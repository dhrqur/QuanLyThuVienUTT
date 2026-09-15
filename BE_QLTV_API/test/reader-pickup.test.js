const test = require("node:test");
const assert = require("node:assert/strict");
const db = require("../src/config/db");
const repository = require("../src/models/repositories/yeucaumuontra.repository");
const { validateApproveBorrow, validateRequestList } = require("../src/middlewares/yeucaumuontra.middleware");

function setup(t, overrides = {}) {
    const state = { request: { MaYC: 1, MaDG: "DG001", MaMT: null, LoaiYeuCau: "MUON", TrangThai: "CHO_DUYET" }, stock: 3, loans: [], cardValid: true, ...overrides };
    let snapshot;
    const connection = {
        async beginTransaction() { snapshot = structuredClone(state); },
        async commit() {},
        async rollback() { Object.assign(state, snapshot); },
        release() {},
        async query(sql, params) {
            if (sql.includes("FROM yeucaumuontra WHERE MaYC")) return [[state.request]];
            if (sql.includes("FROM nhanvien")) return [[{ MaNV: "NV001" }]];
            if (sql.includes("FROM thethuvien")) return [state.cardValid ? [{ MaThe: "T001" }] : []];
            if (sql.includes("FROM muontra WHERE MaDG")) return [state.loans];
            if (sql.includes("SELECT MaYC FROM yeucaumuontra")) return [[]];
            if (sql.includes("FROM chitietyeucaumuon")) return [[{ MaSach: "S001", SoLuong: 2 }]];
            if (sql.includes("FROM sach")) return [[{ MaSach: "S001", TenSach: "Sach", SoLuong: state.stock }]];
            if (sql.includes("INSERT INTO muontra")) { state.loans.push({ MaMT: params[0], NgayMuon: params[3], HanTra: params[4] }); return [{}]; }
            if (sql.includes("INSERT INTO chitietmuontra")) return [{}];
            if (sql.includes("UPDATE sach")) { state.stock -= params[0]; return [{}]; }
            if (sql.includes("UPDATE yeucaumuontra")) {
                if (state.failUpdate) throw new Error("write failed");
                state.request.TrangThai = sql.includes("'DA_LAY'") ? "DA_LAY" : "DA_DUYET";
                if (sql.includes("SET MaMT")) state.request.MaMT = params[0];
                return [{}];
            }
            throw new Error(`Unexpected query: ${sql}`);
        }
    };
    t.mock.method(db, "getConnection", async () => connection);
    t.mock.method(repository, "getById", async () => ({ ...state.request }));
    return state;
}

test("approval leaves stock and loans unchanged; pickup creates the loan exactly once", async (t) => {
    const state = setup(t);
    await repository.approveBorrow(1, "NV001");
    assert.equal(state.request.TrangThai, "DA_DUYET");
    assert.equal(state.stock, 3);
    assert.deepEqual(state.loans, []);
    await repository.confirmPickup(1, "2026-10-01", "NV001", "2026-09-15");
    assert.equal(state.request.TrangThai, "DA_LAY");
    assert.equal(state.stock, 1);
    assert.deepEqual(state.loans, [{ MaMT: "MTY0000001", NgayMuon: "2026-09-15", HanTra: "2026-10-01" }]);
    await assert.rejects(repository.confirmPickup(1, "2026-10-01", "NV001", "2026-09-15"));
    assert.equal(state.loans.length, 1);
    assert.equal(state.stock, 1);
});

for (const scenario of [
    { name: "insufficient stock", stock: 1 },
    { name: "expired card", cardValid: false },
    { name: "existing open loan", loans: [{ MaMT: "MT002" }] },
    { name: "failed final write", failUpdate: true }
]) {
    test(`pickup rolls back for ${scenario.name}`, async (t) => {
        const state = setup(t, scenario);
        state.request.TrangThai = "DA_DUYET";
        const before = structuredClone(state);
        await assert.rejects(repository.confirmPickup(1, "2026-10-01", "NV001", "2026-09-15"));
        assert.deepEqual(state, before);
    });
}

for (const status of ["CHO_DUYET", "TU_CHOI", "DA_HUY", "DA_LAY"]) {
    test(`pickup rejects status ${status}`, async (t) => {
        const state = setup(t);
        state.request.TrangThai = status;
        await assert.rejects(repository.confirmPickup(1, "2026-10-01", "NV001", "2026-09-15"));
        assert.equal(state.stock, 3);
        assert.equal(state.loans.length, 0);
    });
}

test("legacy approval confirms pickup without recreating its loan or deducting stock", async (t) => {
    const state = setup(t);
    Object.assign(state.request, { TrangThai: "DA_DUYET", MaMT: "MT001" });
    await repository.confirmPickup(1, "2026-10-01", "NV001", "2026-09-15");
    assert.equal(state.request.TrangThai, "DA_LAY");
    assert.equal(state.request.MaMT, "MT001");
    assert.equal(state.stock, 3);
    assert.deepEqual(state.loans, []);
});

test("pickup filter is accepted and pickup requires a future due date", () => {
    const req = { query: { trangThai: "DA_LAY" } };
    const res = { status(code) { this.code = code; return this; }, json() { return this; } };
    let passed = false;
    validateRequestList(req, res, () => { passed = true; });
    assert.equal(passed, true);
    for (const body of [{}, { HanTra: "2000-01-01" }]) {
        validateApproveBorrow({ body }, res, () => assert.fail("invalid due date accepted"));
        assert.equal(res.code, 400);
    }
});
