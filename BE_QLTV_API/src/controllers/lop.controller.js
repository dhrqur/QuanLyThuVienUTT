const LopService = require("../services/lop.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class LopController {
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
            const data = await LopService.getAll();

            res.status(200).json({
                message: "Lay danh sach lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await LopService.getById(req.params.maLop);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay lop"
                });
            }

            res.status(200).json({
                message: "Lay thong tin lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await LopService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await LopService.getStatistics();

            res.status(200).json({
                message: "Thong ke lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await LopService.create(req.body);

            res.status(201).json({
                message: "Them lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await LopService.update(req.params.maLop, req.body);

            res.status(200).json({
                message: "Cap nhat lop thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await LopService.delete(req.params.maLop);

            res.status(200).json({
                message: "Xoa lop thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new LopController();
