const repository = require("../models/repositories/quydinhthuvien.repository");
const { handleControllerError } = require("../utils/http");
class QuyDinhThuVienController {
    async get(req, res) {
        try {
            const data = await repository.get();

            res.json({ message: "Lay quy dinh thanh cong", data });
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await repository.update(req.body, req.user.id);

            res.json({ message: "Cap nhat quy dinh thanh cong", data });
        } catch (error) {
            handleControllerError(res, error);
        }
    }
}
module.exports = new QuyDinhThuVienController();
