const TheLoai = require("../models/entities/theloai.entity");
const TheLoaiRepository = require("../models/repositories/theloai.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class TheLoaiService {
    async getAll() {
        return await TheLoaiRepository.getAll();
    }

    async getById(maTL) {
        return await TheLoaiRepository.getById(maTL);
    }

    async search(keyword) {
        return await TheLoaiRepository.search(keyword);
    }

    async getStatistics() {
        return await TheLoaiRepository.getStatistics();
    }

    async create(data) {
        const theLoaiTonTai = await TheLoaiRepository.getById(data.MaTL);

        if (theLoaiTonTai) {
            throw createError("Ma the loai da ton tai", 409);
        }

        const theLoai = new TheLoai(data);

        return await TheLoaiRepository.create(theLoai);
    }

    async update(maTL, data) {
        const theLoaiTonTai = await TheLoaiRepository.getById(maTL);

        if (!theLoaiTonTai) {
            throw createError("Khong tim thay the loai", 404);
        }

        data.MaTL = maTL;

        const theLoai = new TheLoai(data);

        return await TheLoaiRepository.update(maTL, theLoai);
    }

    async delete(maTL) {
        const theLoaiTonTai = await TheLoaiRepository.getById(maTL);

        if (!theLoaiTonTai) {
            throw createError("Khong tim thay the loai", 404);
        }

        const deleted = await TheLoaiRepository.delete(maTL);

        if (!deleted) {
            throw createError("Khong the xoa the loai", 400);
        }

        return true;
    }
}

module.exports = new TheLoaiService();
