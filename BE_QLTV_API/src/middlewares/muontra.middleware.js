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

function sendValidationError(res, message) {
    return res.status(400).json({ message });
}

function validateBorrowDetails(chiTiet, res) {
    if (!Array.isArray(chiTiet) || chiTiet.length === 0) {
        return sendValidationError(res, "Vui long nhap danh sach sach muon");
    }

    const duplicatedBookIds = new Set();

    for (const detail of chiTiet) {
        if (!detail || isEmpty(detail.MaSach) || isEmpty(detail.SoLuong)) {
            return sendValidationError(res, "Chi tiet muon tra phai co MaSach va SoLuong");
        }

        if (String(detail.MaSach).trim().length > 10) {
            return sendValidationError(res, "Ma sach khong duoc vuot qua 10 ky tu");
        }

        if (duplicatedBookIds.has(detail.MaSach)) {
            return sendValidationError(res, "Khong duoc nhap trung sach trong cung mot phieu muon");
        }

        duplicatedBookIds.add(detail.MaSach);

        if (isNaN(detail.SoLuong) || Number(detail.SoLuong) <= 0 || Number(detail.SoLuong) % 1 !== 0) {
            return sendValidationError(res, "So luong sach muon khong hop le");
        }
    }

    return null;
}

function getLoanHeaderError(loan) {
    if (isEmpty(loan.MaMT) || isEmpty(loan.MaDG) || isEmpty(loan.MaNV) || isEmpty(loan.HanTra)) {
        return "Vui long nhap day du thong tin phieu muon";
    }

    if (String(loan.MaMT).trim().length > 10) return "Ma phieu muon khong duoc vuot qua 10 ky tu";
    if (String(loan.MaDG).trim().length > 10) return "Ma doc gia khong duoc vuot qua 10 ky tu";
    if (String(loan.MaNV).trim().length > 10) return "Ma nhan vien khong duoc vuot qua 10 ky tu";
    if (isNaN(Date.parse(loan.NgayMuon))) return "Ngay muon khong hop le";
    if (isNaN(Date.parse(loan.HanTra))) return "Han tra khong hop le";
    if (String(loan.NgayMuon).slice(0, 10) > getCurrentDate()) return "Ngay muon khong duoc lon hon ngay hien tai";
    if (String(loan.HanTra).slice(0, 10) <= String(loan.NgayMuon).slice(0, 10)) return "Han tra phai lon hon ngay muon";
    if (!isEmpty(loan.TrangThai) && String(loan.TrangThai).trim().length > 20) return "Trang thai khong duoc vuot qua 20 ky tu";

    return null;
}

function validateMuonTra(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedMuonTraFields)) {
        return sendValidationError(res, "Du lieu phieu muon co truong khong hop le");
    }

    if (isEmpty(req.body.NgayMuon)) {
        req.body.NgayMuon = getCurrentDate();
    }

    const headerError = getLoanHeaderError(req.body);

    if (headerError) {
        return sendValidationError(res, headerError);
    }

    const detailError = validateBorrowDetails(req.body.ChiTiet, res);

    if (detailError) {
        return detailError;
    }

    next();
}

function validateSearchMuonTra(req, res, next) {
    if (isEmpty(req.query.keyword)) {
        return sendValidationError(res, "Vui long nhap tu khoa tim kiem phieu muon");
    }

    next();
}

function validateReturnDetails(details, res) {
    if (!Array.isArray(details)) {
        return sendValidationError(res, "Chi tiet tra sach khong hop le");
    }

    for (const detail of details) {
        if (hasUnexpectedFields(detail, ["MaSach", "SoLuongHong", "SoLuongMat", "MoTa"])) {
            return sendValidationError(res, "Chi tiet tra sach co truong khong hop le");
        }

        const quantities = [detail.SoLuongHong, detail.SoLuongMat];

        if (isEmpty(detail.MaSach) || quantities.some((value) => !Number.isFinite(Number(value)) || Number(value) < 0)) {
            return sendValidationError(res, "So luong hoac tien phat khong hop le");
        }

        if (!quantities.every(Number.isInteger)) {
            return sendValidationError(res, "So luong sach vi pham phai la so nguyen");
        }
    }

    return null;
}

function validateTraSach(req, res, next) {
    const { NgayTra, ChiTietTra = [] } = req.body;

    if (hasUnexpectedFields(req.body, ["NgayTra", "ChiTietTra"])) {
        return sendValidationError(res, "Du lieu tra sach co truong khong hop le");
    }

    if (isEmpty(NgayTra) || isNaN(Date.parse(NgayTra))) {
        return sendValidationError(res, "Ngay tra khong hop le");
    }

    if (String(NgayTra).slice(0, 10) > getCurrentDate()) {
        return sendValidationError(res, "Ngay tra khong duoc lon hon ngay hien tai");
    }

    const detailError = validateReturnDetails(ChiTietTra, res);

    if (detailError) {
        return detailError;
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
