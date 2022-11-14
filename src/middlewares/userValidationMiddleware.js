const Joi = require('joi')

module.exports = {
    registerUserValidation: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
            password: Joi.string()
                .min(6)
                .max(20)
                .required(),
            subscription: Joi.string(),
            token: Joi.string(),
        })

        const validationResult = schema.validate(req.body)
        if (validationResult.error) {
            return res.status(400).json({status:validationResult.error.details})
        }
        next()
    },

    loginUserValidation: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
            password: Joi.string()
                .min(6)
                .max(20)
                .required(),
            subscription: Joi.string(),
            token: Joi.string(),
        })

        const validationResult = schema.validate(req.body)
        if (validationResult.error) {
            return res.status(400).json({status:validationResult.error.details})
        }
        next()
    },
}