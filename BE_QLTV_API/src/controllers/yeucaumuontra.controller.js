const service = require("../services/yeucaumuontra.service");
const { handleControllerError: handleError } = require("../utils/http");

class YeuCauMuonTraController {
    async listOwn(req, res) {
        try {
            const data = await service.getOwn(req.user.id, req.requestFilters);
            return res.status(200).json({ message: "Lấy yêu cầu cá nhân thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async listAll(req, res) {
        try {
            const data = await service.getAll(req.requestFilters);
            return res.status(200).json({ message: "Lấy danh sách yêu cầu thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await service.create(req.user.id, req.body);
            return res.status(201).json({ message: "Gửi yêu cầu thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async cancel(req, res) {
        try {
            const data = await service.cancel(req.params.maYC, req.user.id);
            return res.status(200).json({ message: "Hủy yêu cầu thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async approveBorrow(req, res) {
        try {
            const data = await service.approveBorrow(req.params.maYC, req.body.HanTra, req.user.id);
            return res.status(200).json({ message: "Duyệt yêu cầu mượn thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async reject(req, res) {
        try {
            const data = await service.reject(
                req.params.maYC,
                req.body.LyDoTuChoi,
                req.user.id
            );
            return res.status(200).json({ message: "Từ chối yêu cầu thành công", data });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new YeuCauMuonTraController();
