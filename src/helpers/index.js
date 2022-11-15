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
    tryCatchWrapper,
    createNotFoundError,
}