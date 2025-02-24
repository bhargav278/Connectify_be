require('dotenv').config()
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const userAuth =async (req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Please Login!");
        } 
        const decodedToken = jwt.verify(token,process.env.SECRET_CODE);
        const {id} = decodedToken;
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not Found!");
        }
        req.user = user;
        next();     
    }
    catch(error){
        res.send("ERROR : "+ error.message);
    }
}

module.exports = userAuth;