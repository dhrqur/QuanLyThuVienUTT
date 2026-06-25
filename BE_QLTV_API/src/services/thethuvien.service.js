const TheThuVien = require("../models/entities/thethuvien.entity");
const TheThuVienRepository = require("../models/repositories/thethuvien.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class TheThuVienService {
    async getAll() {
        return await TheThuVienRepository.getAll();
    }

    async getById(maThe) {
        return await TheThuVienRepository.getById(maThe);
    }

    async search(keyword) {
        return await TheThuVienRepository.search(keyword);
    }

    async getStatistics() {
        return await TheThuVienRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await TheThuVienRepository.getById(data.MaThe);

        if (tonTai) {
            throw createError("Ma the thu vien da ton tai", 409);
        }

        const theThuVien = new TheThuVien(data);

        return await TheThuVienRepository.create(theThuVien);
    }

    async update(maThe, data) {
        const tonTai = await TheThuVienRepository.getById(maThe);

        if (!tonTai) {
            throw createError("Khong tim thay the thu vien", 404);
        }

        data.MaThe = maThe;

        const theThuVien = new TheThuVien(data);

        return await TheThuVienRepository.update(maThe, theThuVien);
    }

    async delete(maThe) {
        const tonTai = await TheThuVienRepository.getById(maThe);

        if (!tonTai) {
            throw createError("Khong tim thay the thu vien", 404);
        }

        try {
            const deleted = await TheThuVienRepository.delete(maThe);

            if (!deleted) {
                throw createError("Khong the xoa the thu vien", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa the thu vien vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new TheThuVienService();
