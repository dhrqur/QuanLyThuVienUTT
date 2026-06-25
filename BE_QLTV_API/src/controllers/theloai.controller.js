const TheLoaiService = require("../services/theloai.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class TheLoaiController {
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
            const data = await TheLoaiService.getAll();

            res.status(200).json({
                message: "Lay danh sach the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await TheLoaiService.getById(req.params.maTL);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay the loai"
                });
            }

            res.status(200).json({
                message: "Lay thong tin the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await TheLoaiService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await TheLoaiService.getStatistics();

            res.status(200).json({
                message: "Thong ke the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await TheLoaiService.create(req.body);

            res.status(201).json({
                message: "Them the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await TheLoaiService.update(req.params.maTL, req.body);

            res.status(200).json({
                message: "Cap nhat the loai thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await TheLoaiService.delete(req.params.maTL);

            res.status(200).json({
                message: "Xoa the loai thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new TheLoaiController();
