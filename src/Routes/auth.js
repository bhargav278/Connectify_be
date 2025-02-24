require('dotenv').config()
const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { signUpValidations } = require('../Utils/validations');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');

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
        res.send("Sign up succesfull!")
    }
    catch (err) {
        res.send("ERROR : " + err.message);
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
            throw new Error("User doesn't exist!");
        }
        else {
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                throw new Error("Invalid Credentials");
            }
            let token = jwt.sign({id : user._id},process.env.SECRET_CODE);
            res.cookie("token",token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            res.send("Login Succesfull!")            
        }
    }
    catch (error) {
        res.send("ERROR : " + error.message);
    }
})

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null , {expires : new Date(Date.now())});
    res.send("Logged out succesfully!");
})

module.exports = authRouter;