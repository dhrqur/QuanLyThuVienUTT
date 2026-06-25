const TacGia = require("../models/entities/tacgia.entity");
const TacGiaRepository = require("../models/repositories/tacgia.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class TacGiaService {
    async getAll() {
        return await TacGiaRepository.getAll();
    }

    async getById(maTG) {
        return await TacGiaRepository.getById(maTG);
    }

    async search(keyword) {
        return await TacGiaRepository.search(keyword);
    }

    async getStatistics() {
        return await TacGiaRepository.getStatistics();
    }

    async create(data) {
        const tacGiaTonTai = await TacGiaRepository.getById(data.MaTG);

        if (tacGiaTonTai) {
            throw createError("Ma tac gia da ton tai", 409);
        }

        const tacGia = new TacGia(data);

        return await TacGiaRepository.create(tacGia);
    }

    async update(maTG, data) {
        const tacGiaTonTai = await TacGiaRepository.getById(maTG);

        if (!tacGiaTonTai) {
            throw createError("Khong tim thay tac gia", 404);
        }

        data.MaTG = maTG;

        const tacGia = new TacGia(data);

        return await TacGiaRepository.update(maTG, tacGia);
    }

    async delete(maTG) {
        const tacGiaTonTai = await TacGiaRepository.getById(maTG);

        if (!tacGiaTonTai) {
            throw createError("Khong tim thay tac gia", 404);
        }

        try {
            const deleted = await TacGiaRepository.delete(maTG);

            if (!deleted) {
                throw createError("Khong the xoa tac gia", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa tac gia vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new TacGiaService();
