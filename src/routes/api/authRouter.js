const express = require('express')
const authRouter = express.Router()
const  { tryCatchWrapper } = require("../../helpers")
const {
    register,
    login,
    logout,
    getCurrentUser,
    updateUserSubscription,
    updateUserAvatar,
} = require('../../controllers/authController')
const { registerUserValidation, loginUserValidation, } = require("../../middlewares/userValidationMiddleware")
const { auth } = require('../../middlewares/auth')
const upload = require('../../middlewares/uploadMiddleware')

authRouter.post('/register', registerUserValidation, tryCatchWrapper(register))
authRouter.post('/login', loginUserValidation, tryCatchWrapper(login))
authRouter.post('/logout', auth, tryCatchWrapper(logout))
authRouter.get('/current', auth, tryCatchWrapper(getCurrentUser))
authRouter.patch('/subscription', auth, tryCatchWrapper(updateUserSubscription))
authRouter.patch('/avatars', auth, upload.single("avatar"), tryCatchWrapper(updateUserAvatar))

module.exports = authRouter