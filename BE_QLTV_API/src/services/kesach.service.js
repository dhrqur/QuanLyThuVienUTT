const KeSach = require("../models/entities/kesach.entity");
const KeSachRepository = require("../models/repositories/kesach.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class KeSachService {
    async getAll() {
        return await KeSachRepository.getAll();
    }

    async getById(maViTri) {
        return await KeSachRepository.getById(maViTri);
    }

    async search(keyword) {
        return await KeSachRepository.search(keyword);
    }

    async getStatistics() {
        return await KeSachRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await KeSachRepository.getById(data.MaViTri);

        if (tonTai) {
            throw createError("Ma ke sach da ton tai", 409);
        }

        const keSach = new KeSach(data);

        return await KeSachRepository.create(keSach);
    }

    async update(maViTri, data) {
        const tonTai = await KeSachRepository.getById(maViTri);

        if (!tonTai) {
            throw createError("Khong tim thay ke sach", 404);
        }

        data.MaViTri = maViTri;

        const keSach = new KeSach(data);

        return await KeSachRepository.update(maViTri, keSach);
    }

    async delete(maViTri) {
        const tonTai = await KeSachRepository.getById(maViTri);

        if (!tonTai) {
            throw createError("Khong tim thay ke sach", 404);
        }

        try {
            const deleted = await KeSachRepository.delete(maViTri);

            if (!deleted) {
                throw createError("Khong the xoa ke sach", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa ke sach vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new KeSachService();
