const repository = require("../models/repositories/quydinhthuvien.repository");
const { handleControllerError } = require("../utils/http");
class QuyDinhThuVienController {
    async get(req, res) { try { res.json({ message: "Lay quy dinh thanh cong", data: await repository.get() }); } catch (error) { handleControllerError(res, error); } }
    async update(req, res) { try { res.json({ message: "Cap nhat quy dinh thanh cong", data: await repository.update(req.body, req.user.id) }); } catch (error) { handleControllerError(res, error); } }
}
module.exports = new QuyDinhThuVienController();
