const MuonTraService = require("../services/muontra.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class MuonTraController {
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.search = this.search.bind(this);
        this.getStatistics = this.getStatistics.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.returnBooks = this.returnBooks.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const data = await MuonTraService.getAll();

            res.status(200).json({
                message: "Lay danh sach phieu muon thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await MuonTraService.getById(req.params.maMT);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay phieu muon"
                });
            }

            res.status(200).json({
                message: "Lay thong tin phieu muon thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await MuonTraService.search(req.query.keyword.trim());

            res.status(200).json({
                message: data.length ? "Tim kiem phieu muon thanh cong" : "Khong tim thay phieu muon",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await MuonTraService.getStatistics();

            res.status(200).json({
                message: "Thong ke phieu muon thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await MuonTraService.create(req.body);

            res.status(201).json({
                message: "Them phieu muon thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await MuonTraService.update(req.params.maMT, req.body);

            res.status(200).json({
                message: "Cap nhat phieu muon thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async returnBooks(req, res) {
        try {
            const data = await MuonTraService.returnBooks(
                req.params.maMT,
                req.body.NgayTra
            );

            res.status(200).json({
                message: "Tra sach thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await MuonTraService.delete(req.params.maMT);

            res.status(200).json({
                message: "Xoa phieu muon thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new MuonTraController();
