const Joi = require("joi")


const outputUser=['createdAt', 'salt', '_id']
const inputLogin= Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})
const inputRegister = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

module.exports = {
    outputUser,
    inputLogin,
    inputRegister
}