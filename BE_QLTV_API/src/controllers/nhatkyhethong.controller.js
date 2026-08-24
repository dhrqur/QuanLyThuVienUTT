const service = require("../services/nhatkyhethong.service");
const { handleControllerError: handleError } = require("../utils/http");

class NhatKyHeThongController {
    async getAll(req, res) {
        try {
            res.json({
                message: "Lay nhat ky he thong thanh cong",
                data: await service.getAll()
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            res.json({
                message: "Tim kiem nhat ky he thong thanh cong",
                data: await service.search(req.query.keyword.trim())
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new NhatKyHeThongController();
