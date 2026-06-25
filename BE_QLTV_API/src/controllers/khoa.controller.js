const KhoaService = require("../services/khoa.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class KhoaController {
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
            const data = await KhoaService.getAll();

            res.status(200).json({
                message: "Lay danh sach khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await KhoaService.getById(req.params.maKhoa);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay khoa"
                });
            }

            res.status(200).json({
                message: "Lay thong tin khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await KhoaService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await KhoaService.getStatistics();

            res.status(200).json({
                message: "Thong ke khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await KhoaService.create(req.body);

            res.status(201).json({
                message: "Them khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await KhoaService.update(req.params.maKhoa, req.body);

            res.status(200).json({
                message: "Cap nhat khoa thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await KhoaService.delete(req.params.maKhoa);

            res.status(200).json({
                message: "Xoa khoa thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new KhoaController();
