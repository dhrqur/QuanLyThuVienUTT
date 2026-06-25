const allowedKhoaFields = [
    "MaKhoa",
    "TenKhoa"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateKhoa(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedKhoaFields)) {
        return res.status(400).json({
            message: "Du lieu khoa co truong khong hop le"
        });
    }

    const {
        MaKhoa,
        TenKhoa
    } = req.body;

    if (
        isEmpty(MaKhoa) ||
        isEmpty(TenKhoa)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin khoa"
        });
    }

    if (String(MaKhoa).trim().length > 10) {
        return res.status(400).json({
            message: "Ma khoa khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenKhoa).trim().length > 100) {
        return res.status(400).json({
            message: "Ten khoa khong duoc vuot qua 100 ky tu"
        });
    }

    next();
}

function validateSearchKhoa(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem khoa"
        });
    }

    next();
}

module.exports = {
    validateKhoa,
    validateSearchKhoa
};
