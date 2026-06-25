const KeSachService = require("../services/kesach.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class KeSachController {
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
            const data = await KeSachService.getAll();

            res.status(200).json({
                message: "Lay danh sach ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await KeSachService.getById(req.params.maViTri);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay ke sach"
                });
            }

            res.status(200).json({
                message: "Lay thong tin ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await KeSachService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await KeSachService.getStatistics();

            res.status(200).json({
                message: "Thong ke ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await KeSachService.create(req.body);

            res.status(201).json({
                message: "Them ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await KeSachService.update(req.params.maViTri, req.body);

            res.status(200).json({
                message: "Cap nhat ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await KeSachService.delete(req.params.maViTri);

            res.status(200).json({
                message: "Xoa ke sach thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new KeSachController();
