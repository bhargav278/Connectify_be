const Joi = require('joi');

const userValidationSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(20)
    .trim()
    .uppercase()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'First name cannot be empty!',
      'string.min': 'Min length of firstname is 2!',
      'string.max': 'Max length of firstname is 20!',
      'string.pattern.base': 'Invalid First name!',
    }),

  lastName: Joi.string()
    .min(2)
    .max(20)
    .trim()
    .uppercase()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'Last name cannot be empty!',
      'string.min': 'Min length of lastname is 2!',
      'string.max': 'Max length of lastname is 20!',
      'string.pattern.base': 'Invalid Last name!',
    }),

  userName: Joi.string()
    .min(5)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.empty': 'Username cannot be empty!',
      'string.min': 'Min length of username is 5!',
      'string.max': 'Max length of username is 50!',
    }),

  emailId: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email cannot be empty!',
      'string.email': 'Invalid Email!',
    }),

  age: Joi.number()
    .min(16)
    .required()
    .messages({
      'number.base': 'Age must be a number!',
      'number.min': 'Too young to use!',
    }),

  gender: Joi.string()
    .valid('male', 'female', 'other')
    .required()
    .messages({
      'any.only': 'Invalid Gender!',
      'string.empty': 'Gender cannot be empty!',
    }),

  phoneNo: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Phone Number!',
      'string.empty': 'Phone number cannot be empty!',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .custom((value, helpers) => {
      const validator = require('validator');
      if (!validator.isStrongPassword(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.invalid': 'Too weak Password!',
      'string.empty': 'Password cannot be empty!',
    }),

  about: Joi.string()
    .max(100)
    .allow(null, '')
    .messages({
      'string.max': 'About section too long!',
    }),

  isDeleted: Joi.boolean().default(false),
});

module.exports = userValidationSchema;
