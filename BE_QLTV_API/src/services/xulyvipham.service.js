const repository = require("../models/repositories/xulyvipham.repository");
const { createHttpError: createError } = require("../utils/http");

class XuLyViPhamService {
    getAll() {
        return repository.getAll();
    }

    search(keyword) {
        return repository.search(keyword);
    }

    async update(maVP, data, employeeId) {
        const violation = await repository.getById(maVP);

        if (!violation) {
            throw createError("Khong tim thay vi pham", 404);
        }

        return repository.update(maVP, data, employeeId);
    }
}
module.exports = new XuLyViPhamService();
