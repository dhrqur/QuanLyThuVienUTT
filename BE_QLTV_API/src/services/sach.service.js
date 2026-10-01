const Sach = require("../models/entities/sach.entity");
const SachRepository = require("../models/repositories/sach.repository");
const QrAssetService = require("./qr-asset.service");
const { createHttpError: createError } = require("../utils/http");

class SachService {
    constructor(repository = SachRepository, qrAssetService = QrAssetService) {
        this.repository = repository;
        this.qrAssetService = qrAssetService;
    }

    async getAll() {
        const data = await this.repository.getAll();
        return data;
    }

    async getById(maSach) {
        const sach = await this.repository.getById(maSach);
        return sach;
    }

    async search(keyword) {
        const data = await this.repository.search(keyword);
        return data;
    }

    async getStatistics() {
        const data = await this.repository.getStatistics();
        return data;
    }

    async create(data) {
        const sachTonTai = await this.repository.getById(data.MaSach);

        if (sachTonTai) {
            throw createError("Ma sach da ton tai", 409);
        }

        const sach = new Sach(data);

        const result = await this.repository.create(sach);
        let qrCreated = false;

        try {
            const qrAsset = await this.qrAssetService.createQrAsset("book", sach.getMaSach());
            qrCreated = true;
            await this.repository.setQrImageUrl(sach.getMaSach(), qrAsset.QrImageUrl);

            return {
                ...result,
                QrImageUrl: qrAsset.QrImageUrl
            };
        } catch (error) {
            if (qrCreated) {
                await this.qrAssetService.deleteQrAsset("book", sach.getMaSach()).catch(() => {});
            }

            await this.repository.delete(sach.getMaSach()).catch(() => {});
            throw createError("Không thể tạo mã QR cho sách", 500);
        }
    }

    async getQrImage(maSach) {
        const sach = await this.repository.getById(maSach);

        if (!sach || !sach.QrImageUrl) {
            throw createError("Không tìm thấy ảnh QR của sách", 404);
        }

        const image = await this.qrAssetService.readQrAsset("book", maSach);

        if (!image) {
            throw createError("Không tìm thấy ảnh QR của sách", 404);
        }

        return image;
    }

    async update(maSach, data) {
        const sachTonTai = await this.repository.getById(maSach);

        if (!sachTonTai) {
            throw createError("Khong tim thay sach", 404);
        }

        data.MaSach = maSach;

        const sach = new Sach(data);

        const result = await this.repository.update(maSach, sach);

        return {
            ...result,
            QrImageUrl: sachTonTai.QrImageUrl ?? null
        };
    }

    async delete(maSach) {
        const sachTonTai = await this.repository.getById(maSach);

        if (!sachTonTai) {
            throw createError("Khong tim thay sach", 404);
        }

        try {
            const deleted = await this.repository.delete(maSach);

            if (!deleted) {
                throw createError("Khong the xoa sach", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa sach vi dang duoc su dung", 400);
        }

        await this.qrAssetService.deleteQrAsset("book", maSach).catch((error) => {
            console.error(`Không thể xóa ảnh QR của sách ${maSach}:`, error.message);
        });

        return true;
    }
}

const sachService = new SachService();

module.exports = sachService;
module.exports.SachService = SachService;
