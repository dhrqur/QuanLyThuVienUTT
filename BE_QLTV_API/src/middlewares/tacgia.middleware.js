const allowedTacGiaFields = [
    "MaTG",
    "TenTG",
    "NamSinh",
    "GioiTinh",
    "QuocTich"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateTacGia(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedTacGiaFields)) {
        return res.status(400).json({
            message: "Du lieu tac gia co truong khong hop le"
        });
    }

    const { MaTG, TenTG, NamSinh, GioiTinh, QuocTich } = req.body;

    if (isEmpty(MaTG) || isEmpty(TenTG) || isEmpty(GioiTinh) || isEmpty(QuocTich)) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin tac gia"
        });
    }

    if (String(MaTG).trim().length > 10) {
        return res.status(400).json({
            message: "Ma tac gia khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenTG).trim().length > 50) {
        return res.status(400).json({
            message: "Ten tac gia khong duoc vuot qua 50 ky tu"
        });
    }

    if (!isEmpty(NamSinh) && (isNaN(NamSinh) || String(NamSinh).trim().length > 11)) {
        return res.status(400).json({
            message: "Nam sinh khong hop le"
        });
    }

    if (String(GioiTinh).trim().length > 20) {
        return res.status(400).json({
            message: "Gioi tinh khong duoc vuot qua 20 ky tu"
        });
    }

    if (String(QuocTich).trim().length > 30) {
        return res.status(400).json({
            message: "Quoc tich khong duoc vuot qua 30 ky tu"
        });
    }

    next();
}

function validateSearchTacGia(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem tac gia"
        });
    }

    next();
}

module.exports = {
    validateTacGia,
    validateSearchTacGia
};
