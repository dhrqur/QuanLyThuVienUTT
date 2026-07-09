const NhanVienService = require("../services/nhanvien.service");

function handleError(res, error) {
    if (error.code === "ECONNREFUSED") {
        return res.status(503).json({
            success: false,
            message: "Khong the ket noi co so du lieu. Vui long kiem tra MySQL."
        });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Loi he thong"
    });
}

class NhanVienController {
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.search = this.search.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getStatistics = this.getStatistics.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const data = await NhanVienService.getAll();

            res.status(200).json({
                message: "Lay danh sach nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const data = await NhanVienService.getById(req.params.maNV);

            if (!data) {
                return res.status(404).json({
                    message: "Khong tim thay nhan vien"
                });
            }

            res.status(200).json({
                message: "Lay thong tin nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async search(req, res) {
        try {
            const data = await NhanVienService.search(req.query.keyword.trim());

            res.status(200).json({
                message: "Tim kiem nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async login(req, res) {
        try {
            const data = await NhanVienService.login(req.body);

            res.status(200).json({
                success: true,
                message: "Dang nhap thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async logout(req, res) {
        try {
            await NhanVienService.logout();

            res.status(200).json({
                success: true,
                message: "Dang xuat thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async getStatistics(req, res) {
        try {
            const data = await NhanVienService.getStatistics();

            res.status(200).json({
                message: "Thong ke nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const data = await NhanVienService.create(req.body);

            res.status(201).json({
                message: "Them nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const data = await NhanVienService.update(req.params.maNV, req.body);

            res.status(200).json({
                message: "Cap nhat nhan vien thanh cong",
                data: data
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            await NhanVienService.delete(req.params.maNV);

            res.status(200).json({
                message: "Xoa nhan vien thanh cong"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new NhanVienController();
