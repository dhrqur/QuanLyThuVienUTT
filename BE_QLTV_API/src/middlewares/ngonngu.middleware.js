const allowedNgonNguFields = [
    "MaNN",
    "TenNN"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateNgonNgu(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedNgonNguFields)) {
        return res.status(400).json({
            message: "Du lieu ngon ngu co truong khong hop le"
        });
    }

    const {
        MaNN,
        TenNN
    } = req.body;

    if (
        isEmpty(MaNN) ||
        isEmpty(TenNN)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin ngon ngu"
        });
    }

    if (String(MaNN).trim().length > 10) {
        return res.status(400).json({
            message: "Ma ngon ngu khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenNN).trim().length > 100) {
        return res.status(400).json({
            message: "Ten ngon ngu khong duoc vuot qua 100 ky tu"
        });
    }

    next();
}

function validateSearchNgonNgu(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem ngon ngu"
        });
    }

    next();
}

module.exports = {
    validateNgonNgu,
    validateSearchNgonNgu
};
