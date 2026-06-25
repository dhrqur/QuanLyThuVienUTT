const NgonNgu = require("../models/entities/ngonngu.entity");
const NgonNguRepository = require("../models/repositories/ngonngu.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class NgonNguService {
    async getAll() {
        return await NgonNguRepository.getAll();
    }

    async getById(maNN) {
        return await NgonNguRepository.getById(maNN);
    }

    async search(keyword) {
        return await NgonNguRepository.search(keyword);
    }

    async getStatistics() {
        return await NgonNguRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await NgonNguRepository.getById(data.MaNN);

        if (tonTai) {
            throw createError("Ma ngon ngu da ton tai", 409);
        }

        const ngonNgu = new NgonNgu(data);

        return await NgonNguRepository.create(ngonNgu);
    }

    async update(maNN, data) {
        const tonTai = await NgonNguRepository.getById(maNN);

        if (!tonTai) {
            throw createError("Khong tim thay ngon ngu", 404);
        }

        data.MaNN = maNN;

        const ngonNgu = new NgonNgu(data);

        return await NgonNguRepository.update(maNN, ngonNgu);
    }

    async delete(maNN) {
        const tonTai = await NgonNguRepository.getById(maNN);

        if (!tonTai) {
            throw createError("Khong tim thay ngon ngu", 404);
        }

        try {
            const deleted = await NgonNguRepository.delete(maNN);

            if (!deleted) {
                throw createError("Khong the xoa ngon ngu", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa ngon ngu vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new NgonNguService();
