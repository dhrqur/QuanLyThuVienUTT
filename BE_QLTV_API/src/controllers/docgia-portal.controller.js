const service = require("../services/docgia-portal.service");
const { handleControllerError: handleError } = require("../utils/http");

class DocGiaPortalController {
    async respond(res, action, message) {
        try {
            const data = await action();
            return res.status(200).json({ message, data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    getDashboard(req, res) {
        return this.respond(res, () => service.getDashboard(req.user.id), "Lấy tổng quan thành công");
    }

    getProfile(req, res) {
        return this.respond(res, () => service.getProfile(req.user.id), "Lấy thông tin cá nhân thành công");
    }

    updateProfile(req, res) {
        return this.respond(
            res,
            () => service.updateProfile(req.user.id, req.body),
            "Cập nhật thông tin cá nhân thành công"
        );
    }

    getLibraryCard(req, res) {
        return this.respond(res, () => service.getLibraryCard(req.user.id), "Lấy thẻ thư viện thành công");
    }

    getCatalog(req, res) {
        return this.respond(
            res,
            () => service.getCatalog(req.query, req.pagination),
            "Lấy danh mục sách thành công"
        );
    }

    getLoans(req, res) {
        return this.respond(res, () => service.getLoans(req.user.id), "Lấy lịch sử mượn trả thành công");
    }

    getViolations(req, res) {
        return this.respond(res, () => service.getViolations(req.user.id), "Lấy vi phạm thành công");
    }
}

module.exports = new DocGiaPortalController();

