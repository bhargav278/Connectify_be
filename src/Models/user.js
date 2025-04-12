const { boolean } = require('joi');
const { Schema ,model } = require('mongoose')
var validator = require('validator');

const userSchema = new Schema({
    firstName : {
        type: String,
        required : [true,"first name can not be empty!"],
        minLength : [2,"min length of firstname is 2!"],
        maxLength : [20,"max lenght of firstname is 20!"],
        trim : true,
        upperCase : true,
        validate(value) {
            if(!validator.isAlpha(value)){
                throw new Error("Invalid First name!");
            }
        }
    },
    lastName : {
        type: String,
        required : [true,"last name can not be empty!"],
        minLength : [2,"min length of lastname is 2!"],
        maxLength : [20,"max lenght of lastrname is 20!"],
        trim : true,
        upperCase : true,
        validate(value) {
            if(!validator.isAlpha(value)){
                throw new Error("Invalid Last name!");
            }
        }
    },
    userName : {
        type: String,
        required: [true,"username can not be empty!"],
        minLength: [5,"min length of username is 5!"],
        maxLength: [50,"max lenght of username is 50!"],
        unique:[true,"UserName Already Exists!"],
        trim: true,
    },
    emailId : {
        type: String,
        required: [true,"email can not be empty!"],
        trim: true,
        unique:[true,"Email Already Exists!"],
        immutable:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email!");
            }
        }
    },
    age : {
        type : Number,
        required: [true,"age can not be empty!"],
        min : 16,
        validate(value){
            if(value<16){
                throw new Error("Too young to use!")
            }
        }
    },
    gender : {
        type: String,
        required: [true,"gender can not be empty!"],
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid Gender!")
            }
        }
    },
    phoneNo : {
        type:String,
        required: [true,"phone no can not be empty!"],
        validate(value){
            if(!validator.isMobilePhone(value,'any',{strictMode:true})){
                throw new Error("Invalid Phone Number!")
            }
        }
    },
    password : {
        type :String,
        required: [true,"password can not be empty!"],
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Too weak Password!")
            }
        }
    },
    about : {
        type : String,
        maxLength : 100,
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
} , {timestamps : true});

const User = model("User",userSchema);

module.exports = User;