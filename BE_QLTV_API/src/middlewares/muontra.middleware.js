const { hasUnexpectedFields, isEmpty } = require("../utils/validation");
const { getCurrentDate } = require("../utils/date");

const allowedMuonTraFields = [
    "MaMT",
    "MaDG",
    "MaNV",
    "NgayMuon",
    "HanTra",
    "TrangThai",
    "ChiTiet"
];

function useAuthenticatedEmployee(req, res, next) {
    req.body.MaNV = req.user.id;
    next();
}

function useCurrentBorrowDate(req, res, next) {
    req.body.NgayMuon = getCurrentDate();
    next();
}

function validateChiTiet(chiTiet, res) {
    if (!Array.isArray(chiTiet) || chiTiet.length === 0) {
        return res.status(400).json({
            message: "Vui long nhap danh sach sach muon"
        });
    }

    const duplicated = new Set();

    for (const item of chiTiet) {
        if (!item || isEmpty(item.MaSach) || isEmpty(item.SoLuong)) {
            return res.status(400).json({
                message: "Chi tiet muon tra phai co MaSach va SoLuong"
            });
        }

        if (String(item.MaSach).trim().length > 10) {
            return res.status(400).json({
                message: "Ma sach khong duoc vuot qua 10 ky tu"
            });
        }

        if (duplicated.has(item.MaSach)) {
            return res.status(400).json({
                message: "Khong duoc nhap trung sach trong cung mot phieu muon"
            });
        }

        duplicated.add(item.MaSach);

        if (isNaN(item.SoLuong) || Number(item.SoLuong) <= 0 || Number(item.SoLuong) % 1 !== 0) {
            return res.status(400).json({
                message: "So luong sach muon khong hop le"
            });
        }
    }

    return null;
}

function validateMuonTra(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedMuonTraFields)) {
        return res.status(400).json({
            message: "Du lieu phieu muon co truong khong hop le"
        });
    }

    if (isEmpty(req.body.NgayMuon)) {
        req.body.NgayMuon = getCurrentDate();
    }

    const {
        MaMT,
        MaDG,
        MaNV,
        NgayMuon,
        HanTra,
        TrangThai,
        ChiTiet
    } = req.body;

    if (
        isEmpty(MaMT) ||
        isEmpty(MaDG) ||
        isEmpty(MaNV) ||
        isEmpty(HanTra)
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin phieu muon"
        });
    }

    if (String(MaMT).trim().length > 10) {
        return res.status(400).json({
            message: "Ma phieu muon khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaDG).trim().length > 10) {
        return res.status(400).json({
            message: "Ma doc gia khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(MaNV).trim().length > 10) {
        return res.status(400).json({
            message: "Ma nhan vien khong duoc vuot qua 10 ky tu"
        });
    }

    if (isNaN(Date.parse(NgayMuon))) {
        return res.status(400).json({
            message: "Ngay muon khong hop le"
        });
    }

    if (isNaN(Date.parse(HanTra))) {
        return res.status(400).json({
            message: "Han tra khong hop le"
        });
    }

    if (String(NgayMuon).slice(0, 10) > getCurrentDate()) {
        return res.status(400).json({
            message: "Ngay muon khong duoc lon hon ngay hien tai"
        });
    }

    if (String(HanTra).slice(0, 10) <= String(NgayMuon).slice(0, 10)) {
        return res.status(400).json({
            message: "Han tra phai lon hon ngay muon"
        });
    }

    if (!isEmpty(TrangThai) && String(TrangThai).trim().length > 20) {
        return res.status(400).json({
            message: "Trang thai khong duoc vuot qua 20 ky tu"
        });
    }

    const chiTietError = validateChiTiet(ChiTiet, res);

    if (chiTietError) {
        return chiTietError;
    }

    next();
}

function validateSearchMuonTra(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem phieu muon"
        });
    }

    next();
}

function validateTraSach(req, res, next) {
    const { NgayTra, ChiTietTra = [] } = req.body;

    if (hasUnexpectedFields(req.body, ["NgayTra", "ChiTietTra"])) {
        return res.status(400).json({
            message: "Du lieu tra sach co truong khong hop le"
        });
    }

    if (isEmpty(NgayTra) || isNaN(Date.parse(NgayTra))) {
        return res.status(400).json({
            message: "Ngay tra khong hop le"
        });
    }


    if (String(NgayTra).slice(0, 10) > getCurrentDate()) {
        return res.status(400).json({
            message: "Ngay tra khong duoc lon hon ngay hien tai"
        });
    }

    if (!Array.isArray(ChiTietTra)) return res.status(400).json({ message: "Chi tiet tra sach khong hop le" });
    for (const item of ChiTietTra) {
        if (hasUnexpectedFields(item, ["MaSach", "SoLuongHong", "SoLuongMat", "MoTa"])) return res.status(400).json({ message: "Chi tiet tra sach co truong khong hop le" });
        const values = [item.SoLuongHong, item.SoLuongMat];
        if (isEmpty(item.MaSach) || values.some((value) => !Number.isFinite(Number(value)) || Number(value) < 0)) return res.status(400).json({ message: "So luong hoac tien phat khong hop le" });
        if (![item.SoLuongHong, item.SoLuongMat].every(Number.isInteger)) return res.status(400).json({ message: "So luong sach vi pham phai la so nguyen" });
    }

    next();
}

module.exports = {
    useAuthenticatedEmployee,
    useCurrentBorrowDate,
    validateMuonTra,
    validateSearchMuonTra,
    validateTraSach
};
