const NhaXuatBan = require("../models/entities/nhaxuatban.entity");
const NhaXuatBanRepository = require("../models/repositories/nhaxuatban.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class NhaXuatBanService {
    async getAll() {
        return await NhaXuatBanRepository.getAll();
    }

    async getById(maNXB) {
        return await NhaXuatBanRepository.getById(maNXB);
    }

    async search(keyword) {
        return await NhaXuatBanRepository.search(keyword);
    }

    async getStatistics() {
        return await NhaXuatBanRepository.getStatistics();
    }

    async create(data) {
        const nhaXuatBanTonTai = await NhaXuatBanRepository.getById(data.MaNXB);

        if (nhaXuatBanTonTai) {
            throw createError("Ma nha xuat ban da ton tai", 409);
        }

        const nhaXuatBan = new NhaXuatBan(data);

        return await NhaXuatBanRepository.create(nhaXuatBan);
    }

    async update(maNXB, data) {
        const nhaXuatBanTonTai = await NhaXuatBanRepository.getById(maNXB);

        if (!nhaXuatBanTonTai) {
            throw createError("Khong tim thay nha xuat ban", 404);
        }

        data.MaNXB = maNXB;

        const nhaXuatBan = new NhaXuatBan(data);

        return await NhaXuatBanRepository.update(maNXB, nhaXuatBan);
    }

    async delete(maNXB) {
        const nhaXuatBanTonTai = await NhaXuatBanRepository.getById(maNXB);

        if (!nhaXuatBanTonTai) {
            throw createError("Khong tim thay nha xuat ban", 404);
        }

        try {
            const deleted = await NhaXuatBanRepository.delete(maNXB);

            if (!deleted) {
                throw createError("Khong the xoa nha xuat ban", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa nha xuat ban vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new NhaXuatBanService();
