const Joi = require('joi');

const requestSendSchema = Joi.object({
    receiverId : Joi.string().guid().required(),
})

const statusSchema = Joi.object({
    senderId : Joi.string().guid().required(),
})

const canceledSchema = Joi.object({
    receiverId : Joi.string().guid().required(),
})

const connectionDisconnectSchema = Joi.object({
    connectionId : Joi.string().guid().required(),
})

module.exports = {
    requestSendSchema,
    statusSchema,
    canceledSchema,
    connectionDisconnectSchema
}