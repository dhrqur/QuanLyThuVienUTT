const DocGiaService = require("../services/docgia.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class DocGiaController {
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
            const data = await DocGiaService.getAll();

            res.status(200).json({
                message: "Lay danh sach doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await DocGiaService.getById(req.params.maDG);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay doc gia"
                });
            }

            res.status(200).json({
                message: "Lay thong tin doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await DocGiaService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await DocGiaService.getStatistics();

            res.status(200).json({
                message: "Thong ke doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await DocGiaService.create(req.body);

            res.status(201).json({
                message: "Them doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await DocGiaService.update(req.params.maDG, req.body);

            res.status(200).json({
                message: "Cap nhat doc gia thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await DocGiaService.delete(req.params.maDG);

            res.status(200).json({
                message: "Xoa doc gia thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new DocGiaController();
