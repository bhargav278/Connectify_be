const express = require('express');
const { requestSendSchema } = require('../schema/schemas');
const { ConnectionRequest } = require('../../models');
const { sendResponse } = require('../Utils/response');
const { where, Op } = require('sequelize');

const connectionRouter = express.Router()


connectionRouter.post('/request', async (req, res) => {

    try {

        const { error } = requestSendSchema.validate(req.body, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }
        if(req.user.userId === req.body.receiverId){
            return sendResponse(400, {success : false, msg : "Can't send request to self!"},res)
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




module.exports = connectionRouter