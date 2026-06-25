const NgonNguService = require("../services/ngonngu.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class NgonNguController {
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
            const data = await NgonNguService.getAll();

            res.status(200).json({
                message: "Lay danh sach ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await NgonNguService.getById(req.params.maNN);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay ngon ngu"
                });
            }

            res.status(200).json({
                message: "Lay thong tin ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await NgonNguService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await NgonNguService.getStatistics();

            res.status(200).json({
                message: "Thong ke ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await NgonNguService.create(req.body);

            res.status(201).json({
                message: "Them ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await NgonNguService.update(req.params.maNN, req.body);

            res.status(200).json({
                message: "Cap nhat ngon ngu thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await NgonNguService.delete(req.params.maNN);

            res.status(200).json({
                message: "Xoa ngon ngu thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new NgonNguController();
