const sgMail = require('@sendgrid/mail')
require("dotenv").config()

const { SENDGRID_API_KEY } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

const sendEmail = async (data) => {
    const email = { ...data, from: "svel2608@gmail.com"}
    try {
        await sgMail.send(email)
        return true
    } catch (error) {
        throw error
    }
}

function tryCatchWrapper(endpointFn) {
    return async (req, res, next) => {
        try {
            await endpointFn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

function createNotFoundError() {
    const err = new Error("Not Found")
    err.status = 404
}

module.exports = {
    sendEmail,
    tryCatchWrapper,
    createNotFoundError,
}