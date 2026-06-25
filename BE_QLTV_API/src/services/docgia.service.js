const DocGia = require("../models/entities/docgia.entity");
const DocGiaRepository = require("../models/repositories/docgia.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class DocGiaService {
    async getAll() {
        return await DocGiaRepository.getAll();
    }

    async getById(maDG) {
        return await DocGiaRepository.getById(maDG);
    }

    async search(keyword) {
        return await DocGiaRepository.search(keyword);
    }

    async getStatistics() {
        return await DocGiaRepository.getStatistics();
    }

    async create(data) {
        const docGiaTonTai = await DocGiaRepository.getById(data.MaDG);

        if (docGiaTonTai) {
            throw createError("Ma doc gia da ton tai", 409);
        }

        const docGia = new DocGia(data);

        return await DocGiaRepository.create(docGia);
    }

    async update(maDG, data) {
        const docGiaTonTai = await DocGiaRepository.getById(maDG);

        if (!docGiaTonTai) {
            throw createError("Khong tim thay doc gia", 404);
        }

        data.MaDG = maDG;

        const docGia = new DocGia(data);

        return await DocGiaRepository.update(maDG, docGia);
    }

    async delete(maDG) {
        const docGiaTonTai = await DocGiaRepository.getById(maDG);

        if (!docGiaTonTai) {
            throw createError("Khong tim thay doc gia", 404);
        }

        try {
            const deleted = await DocGiaRepository.delete(maDG);

            if (!deleted) {
                throw createError("Khong the xoa doc gia", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa doc gia vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new DocGiaService();
