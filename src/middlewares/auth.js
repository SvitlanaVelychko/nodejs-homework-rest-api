const jwt = require('jsonwebtoken')
const { Unauthorized } = require("http-errors");
const { User } = require('../models/userModel')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || ""

    const [tokenType, token] = authHeader.split(" ")
    if (!token) {
        next(new Unauthorized('Please, provide token'))
    }
    if (tokenType === "Bearer" && token) {
        try {
            const verifiedToken = jwt.decode(token, process.env.JWT_SECRET)
            const user = await User.findById(verifiedToken._id)
            if (!user) {
                next(new Unauthorized("No user with such id"))
            }

            if (!user.token) {
                next(new Unauthorized("Token is invalid"))
            }

            if (user.token !== token) {
                next(new Unauthorized("Token is invalid"))
            }

            req.token = token
            req.user = user
            return next()
        } catch (error) {
            next(new Unauthorized("No token"))
        }
    }
}


module.exports = {
    auth,
}