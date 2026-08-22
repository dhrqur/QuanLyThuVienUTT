const allowedDocGiaFields = [
    "MaDG",
    "MaKhoa",
    "MaLop",
    "TenDG",
    "NamSinh",
    "GioiTinh",
    "DiaChi",
    "Email",
    "Sdt"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateDocGia(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedDocGiaFields)) {
        return res.status(400).json({
            message: "Du lieu doc gia co truong khong hop le"
        });
    }

    const {
        MaDG,
        MaKhoa,
        MaLop,
        TenDG,
        NamSinh,
        GioiTinh,
        DiaChi,
        Email,
        Sdt
    } = req.body;

    if (
        isEmpty(MaDG) ||
        isEmpty(MaKhoa) ||
        isEmpty(MaLop) ||
        isEmpty(TenDG) ||
        isEmpty(GioiTinh) ||
        isEmpty(DiaChi) ||
        isEmpty(Email) ||
        isEmpty(Sdt)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin doc gia"
        });
    }

    if (String(MaDG).trim().length > 10) {
        return res.status(400).json({
            message: "Ma doc gia khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaKhoa).trim().length > 10) {
        return res.status(400).json({
            message: "Ma khoa khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaLop).trim().length > 10) {
        return res.status(400).json({
            message: "Ma lop khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenDG).trim().length > 50) {
        return res.status(400).json({
            message: "Ten doc gia khong duoc vuot qua 50 ky tu"
        });
    }

    if (!isEmpty(NamSinh) && (isNaN(NamSinh) || String(NamSinh).trim().length > 10)) {
        return res.status(400).json({
            message: "Nam sinh khong hop le"
        });
    }

    if (String(GioiTinh).trim().length > 10) {
        return res.status(400).json({
            message: "Gioi tinh khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(DiaChi).trim().length > 100) {
        return res.status(400).json({
            message: "Dia chi khong duoc vuot qua 100 ky tu"
        });
    }

    if (String(Email).trim().length > 50 || !String(Email).includes("@")) {
        return res.status(400).json({
            message: "Email khong hop le"
        });
    }

    if (String(Sdt).trim().length > 13 || isNaN(Sdt)) {
        return res.status(400).json({
            message: "So dien thoai khong hop le"
        });
    }

    next();
}

function validateSearchDocGia(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem doc gia"
        });
    }

    next();
}

module.exports = {
    validateDocGia,
    validateSearchDocGia
};
