const allowedChiTietMuonTraFields = [
    "MaMT",
    "MaSach",
    "SoLuong"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateChiTietMuonTra(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedChiTietMuonTraFields)) {
        return res.status(400).json({
            message: "Du lieu chi tiet muon tra co truong khong hop le"
        });
    }

    const {
        MaMT,
        MaSach,
        SoLuong
    } = req.body;

    if (
        isEmpty(MaMT) ||
        isEmpty(MaSach) ||
        isEmpty(SoLuong)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin chi tiet muon tra"
        });
    }

    if (String(MaMT).trim().length > 10) {
        return res.status(400).json({
            message: "Ma muon tra khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaSach).trim().length > 10) {
        return res.status(400).json({
            message: "Ma sach khong duoc vuot qua 10 ky tu"
        });
    }

    if (isNaN(SoLuong) || Number(SoLuong) < 0 || Number(SoLuong) % 1 !== 0) {
        return res.status(400).json({
            message: "So luong khong hop le"
        });
    }

    next();
}

function validateSearchChiTietMuonTra(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem chi tiet muon tra"
        });
    }

    next();
}

module.exports = {
    validateChiTietMuonTra,
    validateSearchChiTietMuonTra
};
