const assert = require("node:assert/strict");
const test = require("node:test");

const {
    buildReaderSummary,
    DocGiaPortalService
} = require("../src/services/docgia-portal.service");

test("updateProfile only persists normalized self-service fields", async () => {
    let saved;
    const repository = {
        async getProfile() {
            return { MaDG: "DG001", TenDG: "Nguyễn An" };
        },
        async updateProfile(maDG, profile) {
            saved = { maDG, profile };
            return { MaDG: maDG, ...profile };
        }
    };
    const service = new DocGiaPortalService(repository);

    await service.updateProfile("DG001", {
        DiaChi: "  Hà Nội  ",
        Email: "  AN@EXAMPLE.COM ",
        Sdt: " 0912345678 "
    });

    assert.deepEqual(saved, {
        maDG: "DG001",
        profile: {
            DiaChi: "Hà Nội",
            Email: "an@example.com",
            Sdt: "0912345678"
        }
    });
});

test("buildReaderSummary separates due-soon and overdue loans", () => {
    const summary = buildReaderSummary(
        [
            { MaMT: "MT1", NgayTra: null, SoNgayConLai: 2, SoNgayQuaHan: 0, DuKienPhiQuaHan: 0 },
            { MaMT: "MT2", NgayTra: null, SoNgayConLai: -4, SoNgayQuaHan: 4, DuKienPhiQuaHan: 8000 },
            { MaMT: "MT3", NgayTra: "2026-01-01", SoNgayConLai: -10, SoNgayQuaHan: 0, DuKienPhiQuaHan: 0 }
        ],
        [
            { MaVP: 1, TrangThaiThu: "CHUA_THU", SoTien: 12000 },
            { MaVP: 2, TrangThaiThu: "DA_THU", SoTien: 5000 }
        ]
    );

    assert.deepEqual(summary, {
        phieuDangMuon: 2,
        phieuSapDenHan: 1,
        phieuQuaHan: 1,
        tienPhatChuaThu: 12000,
        tienPhatDuKien: 8000
    });
});

