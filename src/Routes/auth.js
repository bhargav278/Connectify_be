require('dotenv').config()
const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { signUpValidations } = require('../Utils/validations');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const {sendResponse} = require('../Utils/response')

authRouter.post("/signup", async (req, res) => {
    try {
        signUpValidations(req);
        const { password } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            ...req.body,
            password: encryptedPassword
        });
        await user.save();
        sendResponse(200,{msg: "Signup Successfull!"},res)
    }
    catch (err) {
        sendResponse(400,{msg:err.message},res)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { userEmail, password } = req.body;
        if (!userEmail || !password) {
            throw new Error("Required fields are Empty!");
        }
        const user = await User.findOne({ $or: [{ userName: userEmail }, { emailId: userEmail }] });
        if (!user) {
            sendResponse(404,{msg :"User doesn't exist!"},res);
        }
        else {
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                throw new Error("Invalid Credentials");
            }
            let token = jwt.sign({id : user._id},process.env.SECRET_CODE,{expiresIn:'1d'});
            const responseData = {msg : "Login Succesfull!", token : token}
            sendResponse(200,responseData,res)          
        }
    }
    catch (error) {
        sendResponse(400,{msg : error.message},res);
    }
})

authRouter.post("/logout", async (req,res) => {
    
    //blackList token pending...
    sendResponse(200,{msg : "Logged out succesfully!"},res)
})

module.exports = authRouter;