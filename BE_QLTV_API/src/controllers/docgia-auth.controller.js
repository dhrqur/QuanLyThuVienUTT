const DocGiaAuthService = require("../services/docgia-auth.service");
const { handleControllerError: handleError } = require("../utils/http");

class DocGiaAuthController {
    async login(req, res) {
        try {
            const data = await DocGiaAuthService.login(req.body);
            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                data
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async changePassword(req, res) {
        try {
            const data = await DocGiaAuthService.changePassword(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Đổi mật khẩu thành công",
                data
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new DocGiaAuthController();

