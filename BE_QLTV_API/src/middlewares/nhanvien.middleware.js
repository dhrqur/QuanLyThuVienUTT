const { hasUnexpectedFields, isEmpty, normalizeText } = require("../utils/validation");

const allowedNhanVienFields = [
    "MaNV",
    "TenNV",
    "QueQuan",
    "GioiTinh",
    "NamSinh",
    "VaiTro",
    "Email",
    "Sdt",
    "User",
    "Pass"
];

function validateNhanVien(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedNhanVienFields)) {
        return res.status(400).json({
            message: "Du lieu nhan vien co truong khong hop le"
        });
    }

    const {
        MaNV,
        TenNV,
        QueQuan,
        GioiTinh,
        NamSinh,
        VaiTro,
        Email,
        Sdt,
        User,
        Pass
    } = req.body;
    const isUpdate = req.method === "PUT";

    if (
        isEmpty(MaNV) ||
        isEmpty(TenNV) ||
        isEmpty(QueQuan) ||
        isEmpty(GioiTinh) ||
        isEmpty(NamSinh) ||
        isEmpty(VaiTro) ||
        isEmpty(Email) ||
        isEmpty(Sdt) ||
        isEmpty(User) ||
        (!isUpdate && isEmpty(Pass))
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin nhan vien"
        });
    }

    if (String(MaNV).trim().length > 10) {
        return res.status(400).json({
            message: "Ma nhan vien khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenNV).trim().length > 50) {
        return res.status(400).json({
            message: "Ten nhan vien khong duoc vuot qua 50 ky tu"
        });
    }

    if (String(QueQuan).trim().length > 50) {
        return res.status(400).json({
            message: "Que quan khong duoc vuot qua 50 ky tu"
        });
    }

    if (String(GioiTinh).trim().length > 10) {
        return res.status(400).json({
            message: "Gioi tinh khong duoc vuot qua 10 ky tu"
        });
    }

    const currentYear = new Date().getFullYear();
    if (!/^\d{4}$/.test(String(NamSinh).trim()) || Number(NamSinh) > currentYear) {
        return res.status(400).json({
            message: "Nam sinh khong hop le"
        });
    }

    if (String(VaiTro).trim().length > 100) {
        return res.status(400).json({
            message: "Vai tro khong duoc vuot qua 100 ky tu"
        });
    }

    if (!["quan ly", "thu thu"].includes(normalizeText(VaiTro))) {
        return res.status(400).json({
            message: "Vai tro chi duoc la Quan ly hoac Thu thu"
        });
    }

    if (String(Email).trim().length > 50 || !String(Email).includes("@")) {
        return res.status(400).json({
            message: "Email khong hop le"
        });
    }

    if (!/^\d{10,12}$/.test(String(Sdt).trim())) {
        return res.status(400).json({
            message: "So dien thoai khong hop le"
        });
    }

    if (String(User).trim().length > 50) {
        return res.status(400).json({
            message: "Ten dang nhap khong duoc vuot qua 50 ky tu"
        });
    }


    if (/\s/.test(String(User))) {
        return res.status(400).json({
            message: "Ten dang nhap khong duoc chua khoang trang"
        });
    }

    if (!isEmpty(Pass) && (String(Pass).length < 6 || Buffer.byteLength(String(Pass), "utf8") > 72)) {
        return res.status(400).json({
            message: "Mat khau phai co tu 6 ky tu va khong vuot qua 72 byte"
        });
    }

    next();
}

function validateLogin(req, res, next) {
    const { User, Pass } = req.body;

    if (hasUnexpectedFields(req.body, ["User", "Pass"])) {
        return res.status(400).json({
            success: false,
            message: "Du lieu dang nhap co truong khong hop le"
        });
    }

    if (isEmpty(User) || isEmpty(Pass)) {
        return res.status(400).json({
            success: false,
            message: "Vui long nhap ten dang nhap va mat khau"
        });
    }

    next();
}

function validateSearch(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem"
        });
    }

    next();
}

module.exports = {
    validateNhanVien,
    validateLogin,
    validateSearch
};
