const allowedNhaXuatBanFields = [
    "MaNXB",
    "TenNXB",
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

function validateNhaXuatBan(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedNhaXuatBanFields)) {
        return res.status(400).json({
            message: "Du lieu nha xuat ban co truong khong hop le"
        });
    }

    const { MaNXB, TenNXB, DiaChi, Email, Sdt } = req.body;

    if (isEmpty(MaNXB) || isEmpty(TenNXB) || isEmpty(DiaChi) || isEmpty(Email)) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin nha xuat ban"
        });
    }

    if (String(MaNXB).trim().length > 10) {
        return res.status(400).json({
            message: "Ma nha xuat ban khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenNXB).trim().length > 100) {
        return res.status(400).json({
            message: "Ten nha xuat ban khong duoc vuot qua 100 ky tu"
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

    if (!isEmpty(Sdt) && (String(Sdt).trim().length > 13 || isNaN(Sdt))) {
        return res.status(400).json({
            message: "So dien thoai khong hop le"
        });
    }

    next();
}

function validateSearchNhaXuatBan(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem nha xuat ban"
        });
    }

    next();
}

module.exports = {
    validateNhaXuatBan,
    validateSearchNhaXuatBan
};
