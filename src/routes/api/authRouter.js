const express = require('express')
const authRouter = express.Router()
const  { tryCatchWrapper } = require("../../helpers")
const {
    register,
    login,
    logout,
    getCurrentUser,
    updateUserSubscription,
} = require('../../controllers/authController')
const { registerUserValidation, loginUserValidation, } = require("../../middlewares/userValidationMiddleware")
const { auth } = require('../../middlewares/auth')

authRouter.post('/register', registerUserValidation, tryCatchWrapper(register))
authRouter.post('/login', loginUserValidation, tryCatchWrapper(login))
authRouter.post('/logout', auth, tryCatchWrapper(logout))
authRouter.get('/current', auth, tryCatchWrapper(getCurrentUser))
authRouter.patch('/subscription',auth, tryCatchWrapper(updateUserSubscription))

module.exports = authRouter