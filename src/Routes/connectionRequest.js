const express = require('express');
const { requestSendSchema, statusSchema, canceledSchema, connectionDisconnectSchema } = require('../schema/schemas');
const { ConnectionRequest, Connection, User } = require('../../models');
const { sendResponse } = require('../Utils/response');
const { Op, where } = require('sequelize');
const { model } = require('mongoose');
const sequelize = require('../../models').sequelize;

const connectionRouter = express.Router()

//API for making request
connectionRouter.post('/request', async (req, res) => {

    try {
        const { error } = requestSendSchema.validate(req.body, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }

        if (req.user.userId === req.body.receiverId) {
            return sendResponse(400, { success: false, msg: "Invalid Request!" }, res)
        }

        const alreadyExistingRequest = await ConnectionRequest.findOne({
            where: {
                status: {
                    [Op.in]: ['accepted', 'pending'],
                },
                [Op.or]: [
                    {
                        senderId: req.user.userId,
                        receiverId: req.body.receiverId,

                    },
                    {
                        senderId: req.body.receiverId,
                        receiverId: req.user.userId,
                    }
                ]
            }
        })

        if (alreadyExistingRequest) {
            return sendResponse(400, { success: false, msg: "Request already exists!" }, res)
        }

        await ConnectionRequest.create({
            senderId: req.user.userId,
            receiverId: req.body.receiverId,
        })

        res.send("Request Sent!");
    }
    catch (err) {
        console.log(err);
    }
})

//API for rejecting request
connectionRouter.post('/reject', async (req, res) => {

    try {
        const { error } = statusSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }

        if (req.user.userId === req.body.senderId) {
            return sendResponse(400, { success: false, msg: "Invalid Request!" }, res)
        }

        const connectionRequestExists = await ConnectionRequest.findOne({
            where: {
                senderId: req.body.senderId,
                receiverId: req.user.userId,
                status: "pending"
            }
        })


        if (!connectionRequestExists) {
            return sendResponse(400, { success: false, msg: "Request doesn't Exists!" }, res)
        }

        await ConnectionRequest.update(
            { status: "rejected" },
            {
                where: {
                    requestId: connectionRequestExists.requestId
                }
            }
        )

        sendResponse(200, { success: true, msg: "Request Rejected Successfully!" }, res)
    }
    catch (err) {
        console.log(err);
    }
})


//API for canceling the request
connectionRouter.post("/canceled", async (req, res) => {
    try {
        const { error } = canceledSchema.validate(req.body, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }

        if (req.user.userId === req.body.receiverId) {
            return sendResponse(400, { success: false, msg: "Invalid Request!" }, res)
        }

        const connectionRequestExists = await ConnectionRequest.findOne({
            where: {
                senderId: req.user.userId,
                receiverId: req.body.receiverId,
                status: "pending"
            }
        })

        if (!connectionRequestExists) {
            return sendResponse(400, { success: false, msg: "Request doesn't Exists!" }, res)
        }

        await ConnectionRequest.update(
            { status: "canceled" },
            {
                where: {
                    requestId: connectionRequestExists.requestId
                }
            }
        )

        sendResponse(200, { success: true, msg: "Request Canceled Successfully!" }, res)

    }
    catch (err) {
        console.log(err)
    }
})


//API for accepting the request
connectionRouter.post("/accepted", async (req, res) => {
    try {
        const { error } = statusSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }

        if (req.user.userId === req.body.senderId) {
            return sendResponse(400, { success: false, msg: "Invalid Request!" }, res)
        }

        const connectionRequestExists = await ConnectionRequest.findOne({
            where: {
                senderId: req.body.senderId,
                receiverId: req.user.userId,
                status: "pending"
            }
        })

        if (!connectionRequestExists) {
            return sendResponse(400, { success: false, msg: "Request doesn't Exists!" }, res)
        }

        await sequelize.transaction(async t => {

            await ConnectionRequest.update(
                { status: "accepted" },
                {
                    where: {
                        requestId: connectionRequestExists.requestId
                    },
                    transaction: t,
                }
            )

            await Connection.create({
                senderId: req.body.senderId,
                receiverId: req.user.userId,
                requestId: connectionRequestExists.requestId,
            },
                { transaction: t }
            )
        })

        sendResponse(200, { success: true, msg: "Request Acceted Successfully!" }, res)
    }
    catch (err) {
        console.log(err)
    }
})


//API for Disconnect
connectionRouter.post("/disconnected", async (req, res) => {
    try {
        const { error } = connectionDisconnectSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }

        if (req.user.userId === req.body.senderId) {
            return sendResponse(400, { success: false, msg: "Invalid Request!" }, res)
        }

        const connectionExists = await Connection.findOne({
            where: {
                [Op.and] : [
                    {connectionId : req.body.connectionId},
                    {isDisconnected : false}
                ]
            }
        })

        if (!connectionExists) {
            return sendResponse(400, { success: false, msg: "Connection doesn't Exists!" }, res)
        }

        if(req.user.userId!==connectionExists.senderId && req.user.userId!==connectionExists.receiverId){
            return sendResponse(400, {success : false ,msg : "Invalid Request!"});
        }

        await sequelize.transaction(async t => {

            await Connection.update({ isDisconnected: true }, {
                where: {
                    connectionId: req.body.connectionId,
                },
                transaction : t,
            })

            await ConnectionRequest.update({status : "disconnected"},
               {
                where : {
                    requestId : connectionExists.requestId,
                },
                transaction : t,
               } 
            )
        })

        sendResponse(200,{success:true, msg : "Connection Disconnected!"},res)
    }
    catch (err) {
        console.log(err);
    }
})


connectionRouter.get("/request/pending", async (req,res) => {
    try{
        const userId = req.user.userId;

        const pendingReqData = await ConnectionRequest.findAll({
            where : {
                receiverId : userId,
                status : "pending"
            },
            include : [
                {
                    model : User,
                    as : 'Sender',
                    attributes : ['userId','firstName','lastName','userName']
                }
            ]
        })

        const resData = pendingReqData.map((data)=> data.Sender)

        res.send(resData);
    }
    catch(err){
        console.log(err);
    }
})

connectionRouter.get("/connectedList",async (req,res) => {
    try{
        const userId = req.user.userId;

        const allConnection = await Connection.findAll({
            where: {
                [Op.or] : [
                    {senderId : userId},
                    {receiverId : userId}
                ],
                isDisconnected : false,
            },
            include : [
                {
                    model : User,
                    as : 'Sender',
                    attributes : ['userId','firstName','lastName','userName']
                },
                {
                    model : User,
                    as : 'Receiver',
                    attributes : ['userId','firstName','lastName','userName']
                }
            ]
        })

        const fileteredAllConnection = allConnection.map((connection) => 
        {
            const connectioId = connection.connectionId
            const sender = connection.Sender
            const receiver = connection.Receiver

            if(userId===connection.senderId){
                return {connectionId : connectioId , info : receiver}
            }
            else {
                return {connectionId : connectioId , info : sender}
            }
        })

        res.send(fileteredAllConnection);
    }
    catch(err){
        console.log(err);
    }
})

module.exports = connectionRouter