const allowedTheLoaiFields = [
    "MaTL",
    "TenTL"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateTheLoai(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedTheLoaiFields)) {
        return res.status(400).json({
            message: "Du lieu the loai co truong khong hop le"
        });
    }

    const { MaTL, TenTL } = req.body;

    if (isEmpty(MaTL) || isEmpty(TenTL)) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin the loai"
        });
    }

    if (String(MaTL).trim().length > 10) {
        return res.status(400).json({
            message: "Ma the loai khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenTL).trim().length > 50) {
        return res.status(400).json({
            message: "Ten the loai khong duoc vuot qua 50 ky tu"
        });
    }

    next();
}

function validateSearchTheLoai(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem the loai"
        });
    }

    next();
}

module.exports = {
    validateTheLoai,
    validateSearchTheLoai
};
