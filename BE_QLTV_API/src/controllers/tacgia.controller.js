const TacGiaService = require("../services/tacgia.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class TacGiaController {
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
            const data = await TacGiaService.getAll();

            res.status(200).json({
                message: "Lay danh sach tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await TacGiaService.getById(req.params.maTG);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay tac gia"
                });
            }

            res.status(200).json({
                message: "Lay thong tin tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await TacGiaService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await TacGiaService.getStatistics();

            res.status(200).json({
                message: "Thong ke tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await TacGiaService.create(req.body);

            res.status(201).json({
                message: "Them tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await TacGiaService.update(req.params.maTG, req.body);

            res.status(200).json({
                message: "Cap nhat tac gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await TacGiaService.delete(req.params.maTG);

            res.status(200).json({
                message: "Xoa tac gia thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new TacGiaController();
