const Lop = require("../models/entities/lop.entity");
const LopRepository = require("../models/repositories/lop.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class LopService {
    async getAll() {
        return await LopRepository.getAll();
    }

    async getById(maLop) {
        return await LopRepository.getById(maLop);
    }

    async search(keyword) {
        return await LopRepository.search(keyword);
    }

    async getStatistics() {
        return await LopRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await LopRepository.getById(data.MaLop);

        if (tonTai) {
            throw createError("Ma lop da ton tai", 409);
        }

        const lop = new Lop(data);

        return await LopRepository.create(lop);
    }

    async update(maLop, data) {
        const tonTai = await LopRepository.getById(maLop);

        if (!tonTai) {
            throw createError("Khong tim thay lop", 404);
        }

        data.MaLop = maLop;

        const lop = new Lop(data);

        return await LopRepository.update(maLop, lop);
    }

    async delete(maLop) {
        const tonTai = await LopRepository.getById(maLop);

        if (!tonTai) {
            throw createError("Khong tim thay lop", 404);
        }

        try {
            const deleted = await LopRepository.delete(maLop);

            if (!deleted) {
                throw createError("Khong the xoa lop", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa lop vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new LopService();
