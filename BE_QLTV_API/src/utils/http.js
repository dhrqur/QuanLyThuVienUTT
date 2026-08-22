function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function handleControllerError(res, error) {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Loi he thong"
    });
}

module.exports = { createHttpError, handleControllerError };
