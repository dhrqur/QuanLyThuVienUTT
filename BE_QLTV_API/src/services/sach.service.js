const Sach = require("../models/entities/sach.entity");
const SachRepository = require("../models/repositories/sach.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class SachService {
    async getAll() {
        const data = await SachRepository.getAll();
        return data;
    }

    async getById(maSach) {
        const sach = await SachRepository.getById(maSach);
        return sach;
    }

    async search(keyword) {
        const data = await SachRepository.search(keyword);
        return data;
    }

    async getStatistics() {
        const data = await SachRepository.getStatistics();
        return data;
    }

    async create(data) {
        const sachTonTai = await SachRepository.getById(data.MaSach);

        if (sachTonTai) {
            throw createError("Ma sach da ton tai", 409);
        }

        const sach = new Sach(data);

        const result = await SachRepository.create(sach);

        return result;
    }

    async update(maSach, data) {
        const sachTonTai = await SachRepository.getById(maSach);

        if (!sachTonTai) {
            throw createError("Khong tim thay sach", 404);
        }

        data.MaSach = maSach;

        const sach = new Sach(data);

        const result = await SachRepository.update(maSach, sach);

        return result;
    }

    async delete(maSach) {
        const sachTonTai = await SachRepository.getById(maSach);

        if (!sachTonTai) {
            throw createError("Khong tim thay sach", 404);
        }

        try {
            const deleted = await SachRepository.delete(maSach);

            if (!deleted) {
                throw createError("Khong the xoa sach", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa sach vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new SachService();
