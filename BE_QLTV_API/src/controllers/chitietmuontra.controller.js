const ChiTietMuonTraService = require("../services/chitietmuontra.service");

function handleError(res, error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Loi he thong"
    });
}

class ChiTietMuonTraController {
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
            const data = await ChiTietMuonTraService.getAll();

            res.status(200).json({
                message: "Lay danh sach chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await ChiTietMuonTraService.getById(req.params.maMT, req.params.maSach);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay chi tiet muon tra"
                });
            }

            res.status(200).json({
                message: "Lay thong tin chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await ChiTietMuonTraService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await ChiTietMuonTraService.getStatistics();

            res.status(200).json({
                message: "Thong ke chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await ChiTietMuonTraService.create(req.body);

            res.status(201).json({
                message: "Them chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await ChiTietMuonTraService.update(req.params.maMT, req.params.maSach, req.body);

            res.status(200).json({
                message: "Cap nhat chi tiet muon tra thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await ChiTietMuonTraService.delete(req.params.maMT, req.params.maSach);

            res.status(200).json({
                message: "Xoa chi tiet muon tra thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new ChiTietMuonTraController();
