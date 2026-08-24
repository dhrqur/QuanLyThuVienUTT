const TheThuVien = require("../models/entities/thethuvien.entity");
const TheThuVienRepository = require("../models/repositories/thethuvien.repository");
const { createHttpError: createError } = require("../utils/http");
const { getCurrentDate } = require("../utils/date");

function getCardStatus(expirationDate) {
    const localToday = getCurrentDate();

    return String(expirationDate).slice(0, 10) < localToday
        ? "Hết hạn"
        : "Còn hiệu lực";
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

        const theThuVien = new TheThuVien({
            ...data,
            NgayCap: getCurrentDate(),
            TrangThai: getCardStatus(data.NgayHetHan)
        });

        return await TheThuVienRepository.create(theThuVien);
    }

    async update(maThe, data) {
        const tonTai = await TheThuVienRepository.getById(maThe);

        if (!tonTai) {
            throw createError("Khong tim thay the thu vien", 404);
        }

        const theThuVien = new TheThuVien({
            ...data,
            MaThe: maThe,
            NgayCap: tonTai.NgayCap,
            TrangThai: getCardStatus(data.NgayHetHan)
        });

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
