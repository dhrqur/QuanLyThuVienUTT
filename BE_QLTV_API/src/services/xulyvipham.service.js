const repository = require("../models/repositories/xulyvipham.repository");
const { createHttpError: createError } = require("../utils/http");

class XuLyViPhamService {
    async getAll() { return await repository.getAll(); }
    async search(keyword) { return await repository.search(keyword); }
    async update(maVP, data, employeeId) {
        if (!await repository.getById(maVP)) throw createError("Khong tim thay vi pham", 404);
        return await repository.update(maVP, data, employeeId);
    }
}
module.exports = new XuLyViPhamService();
