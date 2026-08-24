const MuonTra = require("../models/entities/muontra.entity");
const MuonTraRepository = require("../models/repositories/muontra.repository");
const { createHttpError: createError } = require("../utils/http");

function getBusinessStatusCode(message) {
    const normalizedMessage = String(message)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/đ/g, "d");
    const businessMessages = [
        "khong du so luong",
        "khong ton tai",
        "da duoc tra",
        "khong co chi tiet",
        "khong the sua",
        "chi duoc xoa",
        "khong duoc",
        "khong con hieu luc",
        "dang co phieu muon",
        "dang co phieu",
        "chua co the thu vien",
        "the thu vien chua co hieu luc",
        "the thu vien da het han"
    ];

    return businessMessages.some((item) => normalizedMessage.includes(item)) ? 400 : 500;
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
        data.NgayMuon = tonTai.NgayMuon;

        const muonTra = new MuonTra({
            ...data,
            TrangThai: "Dang muon"
        });

        try {
            return await MuonTraRepository.update(maMT, muonTra, data.ChiTiet);
        } catch (error) {
            throw createError(error.message, getBusinessStatusCode(error.message));
        }
    }

    async returnBooks(maMT, ngayTra, chiTietTra, employeeId) {
        const tonTai = await MuonTraRepository.getById(maMT);

        if (!tonTai) {
            throw createError("Khong tim thay phieu muon", 404);
        }

        try {
            return await MuonTraRepository.returnBooks(maMT, ngayTra, chiTietTra, employeeId);
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

            const message = error.code === "ER_ROW_IS_REFERENCED_2"
                ? "Không thể xóa phiếu mượn vì đang có dữ liệu liên quan."
                : error.message;
            throw createError(message, 400);
        }

        return true;
    }
}

module.exports = new MuonTraService();
