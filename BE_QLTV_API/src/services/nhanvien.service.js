const NhanVien = require("../models/entities/nhanvien.entity");
const NhanVienRepository = require("../models/repositories/nhanvien.repository");

const DEFAULT_EMPLOYEE_ROLE = "Nhan vien";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class NhanVienService {
    async getAll() {
        return await NhanVienRepository.getAll();
    }

    async getById(maNV) {
        return await NhanVienRepository.getById(maNV);
    }

    async search(keyword) {
        return await NhanVienRepository.search(keyword);
    }

    async login(data) {
        const user = String(data.User).trim();
        const pass = String(data.Pass).trim();
        const nhanVien = await NhanVienRepository.getByUserWithPassword(user);

        if (!nhanVien || String(nhanVien.Pass) !== pass) {
            throw createError("Ten dang nhap hoac mat khau khong dung", 401);
        }

        const { Pass, ...safeNhanVien } = nhanVien;

        return {
            user: safeNhanVien
        };
    }

    async logout() {
        return true;
    }

    async getStatistics() {
        return await NhanVienRepository.getStatistics();
    }

    async create(data) {
        const maNVTonTai = await NhanVienRepository.getById(data.MaNV);

        if (maNVTonTai) {
            throw createError("Ma nhan vien da ton tai", 409);
        }

        const userTonTai = await NhanVienRepository.getByUser(data.User);

        if (userTonTai) {
            throw createError("Ten dang nhap da ton tai", 409);
        }

        const nhanVien = new NhanVien({
            ...data,
            VaiTro: data.VaiTro || DEFAULT_EMPLOYEE_ROLE
        });

        return await NhanVienRepository.create(nhanVien);
    }

    async update(maNV, data) {
        const nhanVienTonTai = await NhanVienRepository.getByIdWithPassword(maNV);

        if (!nhanVienTonTai) {
            throw createError("Khong tim thay nhan vien", 404);
        }

        const userTonTai = await NhanVienRepository.getByUser(data.User);

        if (userTonTai && userTonTai.MaNV !== maNV) {
            throw createError("Ten dang nhap da ton tai", 409);
        }

        data.MaNV = maNV;
        data.Pass = data.Pass || nhanVienTonTai.Pass;
        data.VaiTro = data.VaiTro || nhanVienTonTai.VaiTro || DEFAULT_EMPLOYEE_ROLE;

        const nhanVien = new NhanVien(data);

        return await NhanVienRepository.update(maNV, nhanVien);
    }

    async delete(maNV) {
        const nhanVienTonTai = await NhanVienRepository.getById(maNV);

        if (!nhanVienTonTai) {
            throw createError("Khong tim thay nhan vien", 404);
        }

        const deleted = await NhanVienRepository.delete(maNV);

        if (!deleted) {
            throw createError("Khong the xoa nhan vien", 400);
        }

        return true;
    }
}

module.exports = new NhanVienService();
