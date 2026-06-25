const NhaXuatBanService = require("../services/nhaxuatban.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class NhaXuatBanController {
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.search = this.search.bind(this);
        this.getStatistics = this.getStatistics.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const data = await NhaXuatBanService.getAll();

            res.status(200).json({
                message: "Lay danh sach nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await NhaXuatBanService.getById(req.params.maNXB);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay nha xuat ban"
                });
            }

            res.status(200).json({
                message: "Lay thong tin nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await NhaXuatBanService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await NhaXuatBanService.getStatistics();

            res.status(200).json({
                message: "Thong ke nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await NhaXuatBanService.create(req.body);

            res.status(201).json({
                message: "Them nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await NhaXuatBanService.update(req.params.maNXB, req.body);

            res.status(200).json({
                message: "Cap nhat nha xuat ban thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await NhaXuatBanService.delete(req.params.maNXB);

            res.status(200).json({
                message: "Xoa nha xuat ban thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new NhaXuatBanController();
