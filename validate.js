const joi = require("joi")

function register(input) {
  return joi.validate(input, {
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    password: joi.string().min(6).max(200).strip().required(),
    first_name: joi.string().min(1).max(100).required(),
    last_name: joi.string().min(1).max(100).required()
  })
}

function login(input) {
  return joi.validate(input, {
    username: joi.string().min(3).max(50),
    email: joi.string().email({ minDomainAtoms: 2 }),
    password: joi.string().min(6).max(200).strip().required(),
  })
}

module.exports = { register, login }
