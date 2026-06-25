const ChiTietMuonTra = require("../models/entities/chitietmuontra.entity");
const ChiTietMuonTraRepository = require("../models/repositories/chitietmuontra.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class ChiTietMuonTraService {
    async getAll() {
        return await ChiTietMuonTraRepository.getAll();
    }

    async getById(maMT, maSach) {
        return await ChiTietMuonTraRepository.getById(maMT, maSach);
    }

    async search(keyword) {
        return await ChiTietMuonTraRepository.search(keyword);
    }

    async getStatistics() {
        return await ChiTietMuonTraRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await ChiTietMuonTraRepository.getById(data.MaMT, data.MaSach);

        if (tonTai) {
            throw createError("Ma chi tiet muon tra da ton tai", 409);
        }

        const chiTietMuonTra = new ChiTietMuonTra(data);

        return await ChiTietMuonTraRepository.create(chiTietMuonTra);
    }

    async update(maMT, maSach, data) {
        const tonTai = await ChiTietMuonTraRepository.getById(maMT, maSach);

        if (!tonTai) {
            throw createError("Khong tim thay chi tiet muon tra", 404);
        }

        data.MaMT = maMT;
        data.MaSach = maSach;

        const chiTietMuonTra = new ChiTietMuonTra(data);

        return await ChiTietMuonTraRepository.update(maMT, maSach, chiTietMuonTra);
    }

    async delete(maMT, maSach) {
        const tonTai = await ChiTietMuonTraRepository.getById(maMT, maSach);

        if (!tonTai) {
            throw createError("Khong tim thay chi tiet muon tra", 404);
        }

        try {
            const deleted = await ChiTietMuonTraRepository.delete(maMT, maSach);

            if (!deleted) {
                throw createError("Khong the xoa chi tiet muon tra", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa chi tiet muon tra vi dang duoc su dung", 400);
        }

        return true;
    }
}

module.exports = new ChiTietMuonTraService();
