const TheThuVien = require("../models/entities/thethuvien.entity");
const TheThuVienRepository = require("../models/repositories/thethuvien.repository");
const QrAssetService = require("./qr-asset.service");
const { createHttpError: createError } = require("../utils/http");
const { getCurrentDate } = require("../utils/date");

function getCardStatus(expirationDate) {
    const localToday = getCurrentDate();

    return String(expirationDate).slice(0, 10) < localToday
        ? "Hết hạn"
        : "Còn hiệu lực";
}

class TheThuVienService {
    constructor(repository = TheThuVienRepository, qrAssetService = QrAssetService) {
        this.repository = repository;
        this.qrAssetService = qrAssetService;
    }

    async getAll() {
        return await this.repository.getAll();
    }

    async getById(maThe) {
        return await this.repository.getById(maThe);
    }

    async search(keyword) {
        return await this.repository.search(keyword);
    }

    async getStatistics() {
        return await this.repository.getStatistics();
    }

    async create(data) {
        const tonTai = await this.repository.getById(data.MaThe);

        if (tonTai) {
            throw createError("Ma the thu vien da ton tai", 409);
        }

        const ngayCap = getCurrentDate();
        const overlappingCard = await this.repository.findOverlappingCard(
            data.MaDG,
            ngayCap,
            data.NgayHetHan
        );
        if (overlappingCard) {
            throw createError(`Độc giả đã có thẻ ${overlappingCard.MaThe} còn hiệu lực`, 409);
        }

        const theThuVien = new TheThuVien({
            ...data,
            NgayCap: ngayCap,
            TrangThai: getCardStatus(data.NgayHetHan)
        });

        const result = await this.repository.create(theThuVien);
        let qrCreated = false;

        try {
            const qrAsset = await this.qrAssetService.createQrAsset("card", theThuVien.getMaThe());
            qrCreated = true;
            await this.repository.setQrImageUrl(theThuVien.getMaThe(), qrAsset.QrImageUrl);

            return {
                ...result,
                QrImageUrl: qrAsset.QrImageUrl
            };
        } catch (error) {
            if (qrCreated) {
                await this.qrAssetService.deleteQrAsset("card", theThuVien.getMaThe()).catch(() => {});
            }

            await this.repository.delete(theThuVien.getMaThe()).catch(() => {});
            throw createError("Không thể tạo mã QR cho thẻ thư viện", 500);
        }
    }

    async getQrImage(maThe) {
        const theThuVien = await this.repository.getById(maThe);

        if (!theThuVien || !theThuVien.QrImageUrl) {
            throw createError("Không tìm thấy ảnh QR của thẻ thư viện", 404);
        }

        const image = await this.qrAssetService.readQrAsset("card", maThe);

        if (!image) {
            throw createError("Không tìm thấy ảnh QR của thẻ thư viện", 404);
        }

        return image;
    }

    async update(maThe, data) {
        const tonTai = await this.repository.getById(maThe);

        if (!tonTai) {
            throw createError("Khong tim thay the thu vien", 404);
        }

        const overlappingCard = await this.repository.findOverlappingCard(
            data.MaDG,
            tonTai.NgayCap,
            data.NgayHetHan,
            maThe
        );
        if (overlappingCard) {
            throw createError(`Độc giả đã có thẻ ${overlappingCard.MaThe} trùng thời gian hiệu lực`, 409);
        }

        const theThuVien = new TheThuVien({
            ...data,
            MaThe: maThe,
            NgayCap: tonTai.NgayCap,
            TrangThai: getCardStatus(data.NgayHetHan)
        });

        const result = await this.repository.update(maThe, theThuVien);

        return {
            ...result,
            QrImageUrl: tonTai.QrImageUrl ?? null
        };
    }

    async delete(maThe) {
        const tonTai = await this.repository.getById(maThe);

        if (!tonTai) {
            throw createError("Khong tim thay the thu vien", 404);
        }

        try {
            const deleted = await this.repository.delete(maThe);

            if (!deleted) {
                throw createError("Khong the xoa the thu vien", 400);
            }
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }

            throw createError("Khong the xoa the thu vien vi dang duoc su dung", 400);
        }

        await this.qrAssetService.deleteQrAsset("card", maThe).catch((error) => {
            console.error(`Không thể xóa ảnh QR của thẻ thư viện ${maThe}:`, error.message);
        });

        return true;
    }
}

const theThuVienService = new TheThuVienService();

module.exports = theThuVienService;
module.exports.TheThuVienService = TheThuVienService;
