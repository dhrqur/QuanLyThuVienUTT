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

function hasMissingEmployeeFields(data, isUpdate) {
    const requiredFields = [
        data.MaNV,
        data.TenNV,
        data.QueQuan,
        data.GioiTinh,
        data.NamSinh,
        data.VaiTro,
        data.Email,
        data.Sdt,
        data.User
    ];

    return requiredFields.some(isEmpty) || (!isUpdate && isEmpty(data.Pass));
}

function isTooLong(value, maxLength) {
    return String(value).trim().length > maxLength;
}

function isValidBirthYear(value, currentYear) {
    return /^\d{4}$/.test(String(value).trim()) && Number(value) <= currentYear;
}

function isValidPassword(value) {
    return isEmpty(value) || (
        String(value).length >= 6
        && Buffer.byteLength(String(value), "utf8") <= 72
    );
}

function validateNhanVien(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedNhanVienFields)) {
        return res.status(400).json({
            message: "Du lieu nhan vien co truong khong hop le"
        });
    }

    const employee = req.body;
    const isUpdate = req.method === "PUT";

    if (hasMissingEmployeeFields(employee, isUpdate)) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin nhan vien"
        });
    }

    if (isTooLong(employee.MaNV, 10)) {
        return res.status(400).json({
            message: "Ma nhan vien khong duoc vuot qua 10 ky tu"
        });
    }

    if (isTooLong(employee.TenNV, 50)) {
        return res.status(400).json({
            message: "Ten nhan vien khong duoc vuot qua 50 ky tu"
        });
    }

    if (isTooLong(employee.QueQuan, 50)) {
        return res.status(400).json({
            message: "Que quan khong duoc vuot qua 50 ky tu"
        });
    }

    if (isTooLong(employee.GioiTinh, 10)) {
        return res.status(400).json({
            message: "Gioi tinh khong duoc vuot qua 10 ky tu"
        });
    }

    if (!isValidBirthYear(employee.NamSinh, new Date().getFullYear())) {
        return res.status(400).json({
            message: "Nam sinh khong hop le"
        });
    }

    if (isTooLong(employee.VaiTro, 100)) {
        return res.status(400).json({
            message: "Vai tro khong duoc vuot qua 100 ky tu"
        });
    }

    if (!["quan ly", "thu thu"].includes(normalizeText(employee.VaiTro))) {
        return res.status(400).json({
            message: "Vai tro chi duoc la Quan ly hoac Thu thu"
        });
    }

    if (isTooLong(employee.Email, 50) || !String(employee.Email).includes("@")) {
        return res.status(400).json({
            message: "Email khong hop le"
        });
    }

    if (!/^\d{10,12}$/.test(String(employee.Sdt).trim())) {
        return res.status(400).json({
            message: "So dien thoai khong hop le"
        });
    }

    if (isTooLong(employee.User, 50)) {
        return res.status(400).json({
            message: "Ten dang nhap khong duoc vuot qua 50 ky tu"
        });
    }

    if (/\s/.test(String(employee.User))) {
        return res.status(400).json({
            message: "Ten dang nhap khong duoc chua khoang trang"
        });
    }

    if (!isValidPassword(employee.Pass)) {
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
    if (isEmpty(req.query.keyword)) {
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
