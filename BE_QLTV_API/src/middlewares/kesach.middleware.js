const allowedKeSachFields = [
    "MaViTri",
    "TenKe",
    "MoTa"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateKeSach(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedKeSachFields)) {
        return res.status(400).json({
            message: "Du lieu ke sach co truong khong hop le"
        });
    }

    const {
        MaViTri,
        TenKe,
        MoTa
    } = req.body;

    if (
        isEmpty(MaViTri) ||
        isEmpty(TenKe) ||
        isEmpty(MoTa)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin ke sach"
        });
    }

    if (String(MaViTri).trim().length > 10) {
        return res.status(400).json({
            message: "Ma vi tri khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenKe).trim().length > 50) {
        return res.status(400).json({
            message: "Ten ke khong duoc vuot qua 50 ky tu"
        });
    }

    if (String(MoTa).trim().length > 50) {
        return res.status(400).json({
            message: "Mo ta khong duoc vuot qua 50 ky tu"
        });
    }

    next();
}

function validateSearchKeSach(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem ke sach"
        });
    }

    next();
}

module.exports = {
    validateKeSach,
    validateSearchKeSach
};
