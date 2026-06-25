const SachService = require("../services/sach.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class SachController {
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
            const data = await SachService.getAll();

            res.status(200).json({
                message: "Lấy danh sách sách thành công",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const data = await SachService.getById(req.params.maSach);

            if (!data) {
                return res.status(404).json({
                    message: "Không tìm thấy sách"
                });
            }

            res.status(200).json({
                message: "Lấy thông tin sách thành công",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async search(req, res) {
        try {
            const data = await SachService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await SachService.getStatistics();

            res.status(200).json({
                message: "Thong ke sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await SachService.create(req.body);

            res.status(201).json({
                message: "Thêm sách thành công",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await SachService.update(req.params.maSach, req.body);

            res.status(200).json({
                message: "Cập nhật sách thành công",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await SachService.delete(req.params.maSach);

            res.status(200).json({
                message: "Xóa sách thành công"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new SachController();
