require('dotenv').config()
const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
// const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../Utils/response')
const { User } = require("../../models");
const { Op } = require('sequelize');
const userValidationSchema = require('../schema/userValidationSchema');

authRouter.post("/signup", async (req, res) => {
    try {

        const { error } = userValidationSchema.validate(req.body, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return sendResponse(400, { success: false, errors: errorMessages }, res)
        }


        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { userName: req.body.userName },
                    { emailId: req.body.emailId }
                ]
            }
        });

        if (existingUser) {
            return sendResponse(400, { success: false, msg: "Username or Email already Exists!" }, res)
        }


        const { password } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        // const user = new User({
        //     ...req.body,
        //     password: encryptedPassword
        // });
        // await user.save();
        const user = await User.create({
            ...req.body,
            password: encryptedPassword
        })
        sendResponse(200, { msg: "Signup Successfull!" }, res)




    }
    catch (err) {
        sendResponse(400, { msg: err.message }, res)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { userEmail, password } = req.body;
        if (!userEmail || !password) {
            throw new Error("Required fields are Empty!");
        }
        // const user = await User.findOne({ $or: [{ userName: userEmail }, { emailId: userEmail }] });
        const user = await User.findOne({ where: { [Op.or]: [{ userName: userEmail }, { emailId: userEmail }] } })
        if (!user) {
            sendResponse(404, { msg: "User doesn't exist!" }, res);
        }
        else {
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                throw new Error("Invalid Credentials");
            }
            let token = jwt.sign({ id: user.userId }, process.env.SECRET_CODE, { expiresIn: '1d' });
            const responseData = { msg: "Login Succesfull!", token: token }
            sendResponse(200, responseData, res)
        }
    }
    catch (error) {
        sendResponse(400, { msg: error.message }, res);
    }
})

authRouter.post("/logout", async (req, res) => {

    //blackList token pending...
    sendResponse(200, { msg: "Logged out succesfully!" }, res)
})

module.exports = authRouter;