const { hasUnexpectedFields, isEmpty } = require("../utils/validation");
const { getCurrentDate } = require("../utils/date");

const allowedTheThuVienFields = [
    "MaThe",
    "MaDG",
    "NgayCap",
    "NgayHetHan",
    "TrangThai"
];

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

    if (!isEmpty(NgayCap) && isNaN(Date.parse(NgayCap))) {
        return res.status(400).json({
            message: "Ngay cap khong hop le"
        });
    }

    if (isNaN(Date.parse(NgayHetHan))) {
        return res.status(400).json({
            message: "Ngay het han khong hop le"
        });
    }

    if (String(NgayHetHan).slice(0, 10) <= getCurrentDate()) {
        return res.status(400).json({
            message: "Ngày hết hạn phải lớn hơn ngày cấp hiện tại"
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
