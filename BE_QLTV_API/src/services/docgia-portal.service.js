const DocGiaPortalRepository = require("../models/repositories/docgia-portal.repository");
const { createHttpError: createError } = require("../utils/http");
const { normalizeEmail, trimText } = require("../utils/validation");

function buildReaderSummary(loans, violations) {
    const openLoans = loans.filter((loan) => !loan.NgayTra);
    return {
        phieuDangMuon: openLoans.length,
        phieuSapDenHan: openLoans.filter(
            (loan) => Number(loan.SoNgayConLai) >= 0 && Number(loan.SoNgayConLai) <= 3
        ).length,
        phieuQuaHan: openLoans.filter((loan) => Number(loan.SoNgayQuaHan) > 0).length,
        tienPhatChuaThu: violations
            .filter((violation) => violation.TrangThaiThu === "CHUA_THU")
            .reduce((total, violation) => total + Number(violation.SoTien || 0), 0),
        tienPhatDuKien: openLoans.reduce(
            (total, loan) => total + Number(loan.DuKienPhiQuaHan || 0),
            0
        )
    };
}

class DocGiaPortalService {
    constructor(repository = DocGiaPortalRepository) {
        this.repository = repository;
    }

    async getProfile(maDG) {
        const profile = await this.repository.getProfile(maDG);
        if (!profile) throw createError("Không tìm thấy độc giả", 404);
        return profile;
    }

    async updateProfile(maDG, data) {
        const current = await this.getProfile(maDG);
        const profile = {
            DiaChi: data.DiaChi === undefined ? current.DiaChi : trimText(data.DiaChi),
            Email: data.Email === undefined ? current.Email : normalizeEmail(data.Email),
            Sdt: data.Sdt === undefined ? current.Sdt : trimText(data.Sdt)
        };
        return await this.repository.updateProfile(maDG, profile);
    }

    async getLibraryCard(maDG) {
        return await this.repository.getLibraryCard(maDG);
    }

    async getCatalog(query, pagination) {
        return await this.repository.getCatalog({
            keyword: trimText(query.keyword),
            ...pagination
        });
    }

    async getLoans(maDG) {
        return await this.repository.getLoans(maDG);
    }

    async getViolations(maDG) {
        return await this.repository.getViolations(maDG);
    }

    async getDashboard(maDG) {
        const [profile, libraryCard, loans, violations] = await Promise.all([
            this.getProfile(maDG),
            this.getLibraryCard(maDG),
            this.getLoans(maDG),
            this.getViolations(maDG)
        ]);
        return {
            profile,
            libraryCard,
            summary: buildReaderSummary(loans, violations),
            activeLoans: loans.filter((loan) => !loan.NgayTra),
            recentViolations: violations.slice(0, 5)
        };
    }
}

module.exports = new DocGiaPortalService();
module.exports.buildReaderSummary = buildReaderSummary;
module.exports.DocGiaPortalService = DocGiaPortalService;

