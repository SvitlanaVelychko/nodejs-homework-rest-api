const { User } = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require("path")
const fs = require("fs/promises")
const gravatar = require("gravatar")
const { nanoid } = require("nanoid")
const Jimp = require("jimp")
const {sendEmail, createNotFoundError} = require('../helpers')


const register = async (req, res, next) => {
    const { email, password } = req.body
    const avatarUrl = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({"message": "Email in use"})
    }
    
    try {
        const verificationToken = nanoid()
        const user = new User({ email, password, avatarUrl, verificationToken })
        await user.save()

        const msg = {
            to: email,
            subject: "Verification email",
            text: `Hello dear user. Please click at http//localhost:3000/api/users/verify/${verificationToken} to verify your email`,
            html: `<b>Hello dear user</b><br>
            <a href="http://localhost:3000/api/users/verify/${verificationToken}">Please confirm your email</a>`
        }

        await sendEmail(msg)

        return res.status(201).json({
            data: {
                user: {
                    email,
                    subscription: user.subscription,
                    avatarUrl,
                    verificationToken,
                },
            },
        })
    } catch (error) {
        next(error)
    }
}

const login= async(req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
        return res.status(401).json({"message": "Email or password is wrong"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({"message": "Email or password is wrong"})
    }

    if (!user.verify) {
        return res.status(401).json({"message": "Email is not verify"})
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET , { expiresIn: "1h" })
    user.token = token
    await User.findByIdAndUpdate(user._id, user)
    return res.status(200).json({
        data: {
            token,
            user: {
                email,
                subscription: user.subscription,
            }
        },
    })
}

const logout = async (req, res, next) => {
    const { user } = req
    user.token = null
    await User.findByIdAndUpdate(user._id, user , {new: true} )

    return res.status(204).json({})
}

const getCurrentUser = async (req, res, next) => {
    const { email, subscription } = req.user

    res.status(200).json({ 
        data: {
            user: {
                email,
                subscription
            },
        },
    })
}

const updateUserSubscription = async (req, res, next) => {
    const { subscription } = req.body
    const { _id } = req.user
    const updatedUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true })
    
    return res.status(200).json({
        data: {
            updatedUser,
        }
    })
}

const updateUserAvatar = async (req, res, next) => {
    const { path: tmpFilePath, originalname } = req.file
    const { _id } = req.user
    const avatarsDir = path.join(__dirname, "../../", "public", "avatars")
    const newFileName = nanoid() + `_${ originalname }`
    const newFilePath = path.join(avatarsDir, originalname)
    try {
        const file = await Jimp.read(tmpFilePath)
        file.resize(250, 250).write(tmpFilePath)
        await fs.rename(tmpFilePath, newFilePath)
        const avatarUrl = path.join("public", "avatars", newFileName)

        await User.findByIdAndUpdate(_id, { avatarUrl })
        return res.status(200).json({ avatarUrl })
    } catch (error) {
        await fs.unlink(tmpFilePath)
        next(error.message)
    }
}

const verifyEmail = async (req, res, next) => {
    const { verificationToken } = req.params
    const user = await User.findOne({ verificationToken })

    if (user) {
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null }, { new: true })
        res.status(200).json({
            message: 'Verification successful',
        })
    }
    return next(createNotFoundError())
}

const verifyUser = async (req, res) => {
    const { email } = req.body
    
    if (!email) {
        return res.status(400).json({"message": "missing required field email"})
    }

    const user = await User.findOne({ email })

    if (!user.verify) {
        const msg = {
        to: email,
        subject: "Verification email",
        text: `Hello dear user. Please click at http://localhost:3000/api/users/verify/${user.verificationToken} to verify your email`,
        html: `<b>Hello dear user</b><br>
            <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Please confirm your email</a>`
        }

        await sendEmail(msg)
        res.status(200).json({
            "message": "Verification email sent",
        })
    }
    return res.status(400).json({
        "message":"Verification has already been passed",
    })
}


module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    updateUserSubscription,
    updateUserAvatar,
    verifyEmail,
    verifyUser,
}