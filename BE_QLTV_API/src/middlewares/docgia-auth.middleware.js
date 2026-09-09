const { hasUnexpectedFields, isEmpty } = require("../utils/validation");

function validateReaderLogin(req, res, next) {
    if (hasUnexpectedFields(req.body, ["MaDG", "Pass"])) {
        return res.status(400).json({ message: "Dữ liệu đăng nhập có trường không hợp lệ" });
    }

    const { MaDG, Pass } = req.body;
    if (isEmpty(MaDG) || isEmpty(Pass)) {
        return res.status(400).json({ message: "Vui lòng nhập mã sinh viên và mật khẩu" });
    }

    if (String(MaDG).trim().length > 10 || Buffer.byteLength(String(Pass), "utf8") > 72) {
        return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    next();
}

function validatePasswordChange(req, res, next) {
    if (hasUnexpectedFields(req.body, ["MatKhauCu", "MatKhauMoi"])) {
        return res.status(400).json({ message: "Dữ liệu đổi mật khẩu có trường không hợp lệ" });
    }

    const { MatKhauCu, MatKhauMoi } = req.body;
    if (isEmpty(MatKhauCu) || isEmpty(MatKhauMoi)) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu" });
    }

    if (
        Buffer.byteLength(String(MatKhauCu), "utf8") > 72
        || String(MatKhauMoi).length < 6
        || Buffer.byteLength(String(MatKhauMoi), "utf8") > 72
    ) {
        return res.status(400).json({ message: "Mật khẩu phải có từ 6 đến 72 byte" });
    }

    next();
}

module.exports = { validatePasswordChange, validateReaderLogin };
