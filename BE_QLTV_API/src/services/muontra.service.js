const MuonTra = require("../models/entities/muontra.entity");
const MuonTraRepository = require("../models/repositories/muontra.repository");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function getBusinessStatusCode(message) {
    const businessMessages = [
        "khong du so luong",
        "khong ton tai",
        "da duoc tra",
        "khong co chi tiet",
        "Khong the sua",
        "Chi duoc xoa"
    ];

    return businessMessages.some((item) => message.includes(item)) ? 400 : 500;
}

class MuonTraService {
    async getAll() {
        return await MuonTraRepository.getAll();
    }

    async getById(maMT) {
        return await MuonTraRepository.getById(maMT);
    }

    async search(keyword) {
        return await MuonTraRepository.search(keyword);
    }

    async getStatistics() {
        return await MuonTraRepository.getStatistics();
    }

    async create(data) {
        const tonTai = await MuonTraRepository.getById(data.MaMT);

        if (tonTai) {
            throw createError("Ma phieu muon da ton tai", 409);
        }

        const muonTra = new MuonTra({
            ...data,
            TrangThai: "Dang muon"
        });

        try {
            return await MuonTraRepository.create(muonTra, data.ChiTiet);
        } catch (error) {
            throw createError(error.message, getBusinessStatusCode(error.message));
        }
    }

    async update(maMT, data) {
        const tonTai = await MuonTraRepository.getById(maMT);

        if (!tonTai) {
            throw createError("Khong tim thay phieu muon", 404);
        }

        data.MaMT = maMT;

        const muonTra = new MuonTra(data);

        try {
            return await MuonTraRepository.update(maMT, muonTra, data.ChiTiet);
        } catch (error) {
            throw createError(error.message, getBusinessStatusCode(error.message));
        }
    }

    async returnBooks(maMT, ngayTra) {
        const tonTai = await MuonTraRepository.getById(maMT);

        if (!tonTai) {
            throw createError("Khong tim thay phieu muon", 404);
        }

        try {
            return await MuonTraRepository.returnBooks(maMT, ngayTra);
        } catch (error) {
            throw createError(error.message, getBusinessStatusCode(error.message));
        }
    }

    async delete(maMT) {
        const tonTai = await MuonTraRepository.getById(maMT);

        if (!tonTai) {
            throw createError("Khong tim thay phieu muon", 404);
        }

        try {
            const deleted = await MuonTraRepository.delete(maMT);

            if (!deleted) {
                throw createError("Khong the xoa phieu muon", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError(error.message, 400);
        }

        return true;
    }
}

module.exports = new MuonTraService();
