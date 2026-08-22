const service = require("../services/xulyvipham.service");
const { handleControllerError: handleError } = require("../utils/http");
class XuLyViPhamController {
    async getAll(req, res) { try { res.json({ message: "Lay danh sach vi pham thanh cong", data: await service.getAll() }); } catch (error) { handleError(res, error); } }
    async search(req, res) { try { res.json({ message: "Tim kiem vi pham thanh cong", data: await service.search(req.query.keyword.trim()) }); } catch (error) { handleError(res, error); } }
    async update(req, res) { try { res.json({ message: "Cap nhat vi pham thanh cong", data: await service.update(req.params.maVP, req.body, req.user.id) }); } catch (error) { handleError(res, error); } }
}
module.exports = new XuLyViPhamController();
