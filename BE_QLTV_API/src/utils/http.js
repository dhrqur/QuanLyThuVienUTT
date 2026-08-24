function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function handleControllerError(res, error) {
    const publicError = getPublicHttpError(error);
    return res.status(publicError.statusCode).json({ message: publicError.message });
}

function getPublicHttpError(error) {
    if (error?.statusCode) {
        if (error.statusCode >= 500 || looksLikeTechnicalError(error.message)) {
            console.error("Lỗi hệ thống:", error);
            return {
                statusCode: error.statusCode >= 500 ? error.statusCode : 500,
                message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
            };
        }

        return {
            statusCode: error.statusCode,
            message: error.message || "Yêu cầu không thể thực hiện."
        };
    }

    switch (error?.code) {
    case "ER_ROW_IS_REFERENCED":
    case "ER_ROW_IS_REFERENCED_2":
        return {
            statusCode: 409,
            message: "Không thể xóa dữ liệu này vì đang được sử dụng ở chức năng khác."
        };
    case "ER_NO_REFERENCED_ROW":
    case "ER_NO_REFERENCED_ROW_2":
        return {
            statusCode: 400,
            message: "Dữ liệu liên quan không tồn tại hoặc đã bị xóa. Vui lòng tải lại trang."
        };
    case "ER_DUP_ENTRY": {
        const duplicateMessage = String(error.message || "");

        if (/email/i.test(duplicateMessage)) {
            return {
                statusCode: 409,
                message: "Email này đã được sử dụng. Vui lòng nhập email khác."
            };
        }

        if (/(sdt|phone)/i.test(duplicateMessage)) {
            return {
                statusCode: 409,
                message: "Số điện thoại này đã được sử dụng. Vui lòng nhập số khác."
            };
        }

        if (/(user|username)/i.test(duplicateMessage)) {
            return {
                statusCode: 409,
                message: "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác."
            };
        }

        return {
            statusCode: 409,
            message: "Mã hoặc thông tin này đã tồn tại. Vui lòng kiểm tra lại."
        };
    }
    case "ER_DATA_TOO_LONG":
    case "ER_TRUNCATED_WRONG_VALUE":
        return {
            statusCode: 400,
            message: "Dữ liệu nhập không hợp lệ hoặc vượt quá độ dài cho phép."
        };
    case "ECONNREFUSED":
        return {
            statusCode: 503,
            message: "Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau."
        };
    default:
        console.error("Lỗi hệ thống:", error);
        return {
            statusCode: 500,
            message: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
        };
    }
}

function looksLikeTechnicalError(message) {
    return /(foreign key|constraint|cannot delete or update|sql syntax|ER_[A-Z_]+|SELECT\s|INSERT\s|UPDATE\s|DELETE\s+FROM)/i
        .test(String(message || ""));
}

module.exports = { createHttpError, getPublicHttpError, handleControllerError };
