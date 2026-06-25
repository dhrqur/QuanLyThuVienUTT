const Khoa = require("../models/entities/khoa.entity");
const KhoaRepository = require("../models/repositories/khoa.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class KhoaService {
    async getAll() {
        return await KhoaRepository.getAll();
    }

    async getById(maKhoa) {
        return await KhoaRepository.getById(maKhoa);
    }

    async search(keyword) {
        return await KhoaRepository.search(keyword);
    }

    async getStatistics() {
        return await KhoaRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await KhoaRepository.getById(data.MaKhoa);

        if (tonTai) {
            throw createError("Ma khoa da ton tai", 409);
        }

        const khoa = new Khoa(data);

        return await KhoaRepository.create(khoa);
    }

    async update(maKhoa, data) {
        const tonTai = await KhoaRepository.getById(maKhoa);

        if (!tonTai) {
            throw createError("Khong tim thay khoa", 404);
        }

        data.MaKhoa = maKhoa;

        const khoa = new Khoa(data);

        return await KhoaRepository.update(maKhoa, khoa);
    }

    async delete(maKhoa) {
        const tonTai = await KhoaRepository.getById(maKhoa);

        if (!tonTai) {
            throw createError("Khong tim thay khoa", 404);
        }

        try {
            const deleted = await KhoaRepository.delete(maKhoa);

            if (!deleted) {
                throw createError("Khong the xoa khoa", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa khoa vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new KhoaService();
