const NhanVien = require("../models/entities/nhanvien.entity");
const NhanVienRepository = require("../models/repositories/nhanvien.repository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createAccessToken } = require("../middlewares/auth.middleware");

const DEFAULT_EMPLOYEE_ROLE = "Thu thu";
const BCRYPT_ROUNDS = 12;

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password, storedPassword) {
    const passwordValue = String(storedPassword);

    if (passwordValue.startsWith("$2")) {
        return await bcrypt.compare(password, passwordValue);
    }

    if (passwordValue.startsWith("scrypt$")) {
        const [, salt, encodedHash] = passwordValue.split("$");

        if (!salt || !encodedHash) return false;

        const expectedHash = Buffer.from(encodedHash, "base64url");
        const actualHash = await new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, expectedHash.length, (error, derivedKey) => {
                if (error) reject(error);
                else resolve(derivedKey);
            });
        });

        return actualHash.length === expectedHash.length
            && crypto.timingSafeEqual(actualHash, expectedHash);
    }

    return password === passwordValue;
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

        if (!nhanVien || !(await verifyPassword(pass, String(nhanVien.Pass)))) {
            throw createError("Ten dang nhap hoac mat khau khong dung", 401);
        }

        if (!String(nhanVien.Pass).startsWith("$2")) {
            await NhanVienRepository.updatePassword(nhanVien.MaNV, await hashPassword(pass));
        }

        const { Pass, ...safeNhanVien } = nhanVien;

        return {
            token: createAccessToken(safeNhanVien),
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
            Pass: await hashPassword(String(data.Pass).trim()),
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
        data.Pass = data.Pass ? await hashPassword(String(data.Pass).trim()) : nhanVienTonTai.Pass;
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
