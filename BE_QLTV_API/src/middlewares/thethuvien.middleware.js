const allowedTheThuVienFields = [
    "MaThe",
    "MaDG",
    "NgayCap",
    "NgayHetHan",
    "TrangThai"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateTheThuVien(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedTheThuVienFields)) {
        return res.status(400).json({
            message: "Du lieu the thu vien co truong khong hop le"
        });
    }

    const {
        MaThe,
        MaDG,
        NgayCap,
        NgayHetHan
    } = req.body;

    if (
        isEmpty(MaThe) ||
        isEmpty(MaDG) ||
        isEmpty(NgayCap) ||
        isEmpty(NgayHetHan)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin the thu vien"
        });
    }

    if (String(MaThe).trim().length > 10) {
        return res.status(400).json({
            message: "Ma the khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaDG).trim().length > 10) {
        return res.status(400).json({
            message: "Ma doc gia khong duoc vuot qua 10 ky tu"
        });
    }

    if (isNaN(Date.parse(NgayCap))) {
        return res.status(400).json({
            message: "Ngay cap khong hop le"
        });
    }

    if (isNaN(Date.parse(NgayHetHan))) {
        return res.status(400).json({
            message: "Ngay het han khong hop le"
        });
    }

    next();
}

function validateSearchTheThuVien(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem the thu vien"
        });
    }

    next();
}

module.exports = {
    validateTheThuVien,
    validateSearchTheThuVien
};
