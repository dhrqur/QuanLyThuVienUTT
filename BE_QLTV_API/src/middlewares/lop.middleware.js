const allowedLopFields = [
    "MaLop",
    "TenLop",
    "MaKhoa"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateLop(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedLopFields)) {
        return res.status(400).json({
            message: "Du lieu lop co truong khong hop le"
        });
    }

    const {
        MaLop,
        TenLop,
        MaKhoa
    } = req.body;

    if (
        isEmpty(MaLop) ||
        isEmpty(TenLop)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin lop"
        });
    }

    if (String(MaLop).trim().length > 10) {
        return res.status(400).json({
            message: "Ma lop khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenLop).trim().length > 100) {
        return res.status(400).json({
            message: "Ten lop khong duoc vuot qua 100 ky tu"
        });
    }

    if (!isEmpty(MaKhoa) && String(MaKhoa).trim().length > 10) {
        return res.status(400).json({
            message: "Ma khoa khong duoc vuot qua 10 ky tu"
        });
    }

    next();
}

function validateSearchLop(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem lop"
        });
    }

    next();
}

module.exports = {
    validateLop,
    validateSearchLop
};
