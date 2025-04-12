const Joi = require('joi');


const requestSendSchema = Joi.object({
    receiverId : Joi.string().guid().required(),
})

module.exports = {
    requestSendSchema
}