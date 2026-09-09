const assert = require("node:assert/strict");
const test = require("node:test");

const { buildLoanIdFromRequest } = require("../src/models/repositories/yeucaumuontra.repository");
const {
    validateCreateRequest,
    validateRejectRequest,
    validateRequestList
} = require("../src/middlewares/yeucaumuontra.middleware");
const { YeuCauMuonTraService } = require("../src/services/yeucaumuontra.service");

function createResponse() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

test("borrow request loan id is deterministic and fits the existing key", () => {
    assert.equal(buildLoanIdFromRequest(42), "MTY0000042");
    assert.throws(() => buildLoanIdFromRequest(10000000), /không hợp lệ/i);
});

test("borrow request rejects duplicated books", () => {
    const req = {
        body: {
            LoaiYeuCau: "MUON",
            ChiTiet: [
                { MaSach: "S001", SoLuong: 1 },
                { MaSach: "S001", SoLuong: 2 }
            ]
        }
    };
    const res = createResponse();

    validateCreateRequest(req, res, () => assert.fail("must reject duplicates"));

    assert.equal(res.statusCode, 400);
});

test("borrow request limits the number of distinct books", () => {
    const req = {
        body: {
            LoaiYeuCau: "MUON",
            ChiTiet: Array.from({ length: 51 }, (_, index) => ({
                MaSach: `S${String(index).padStart(3, "0")}`,
                SoLuong: 1
            }))
        }
    };
    const res = createResponse();

    validateCreateRequest(req, res, () => assert.fail("must reject oversized requests"));

    assert.equal(res.statusCode, 400);
});

test("return request requires a loan id and does not accept reader identity", () => {
    const req = { body: { LoaiYeuCau: "TRA", MaDG: "DG002" } };
    const res = createResponse();

    validateCreateRequest(req, res, () => assert.fail("must reject identity input"));

    assert.equal(res.statusCode, 400);
});

test("rejection requires a meaningful reason", () => {
    const req = { body: { LyDoTuChoi: "  " } };
    const res = createResponse();

    validateRejectRequest(req, res, () => assert.fail("must require reason"));

    assert.equal(res.statusCode, 400);
});

test("request filters are normalized without mutating Express query", () => {
    const query = Object.freeze({ trangThai: "cho_duyet", loaiYeuCau: "tra" });
    const req = { query };
    const res = createResponse();

    validateRequestList(req, res, () => {});

    assert.equal(req.query, query);
    assert.deepEqual(req.requestFilters, {
        trangThai: "CHO_DUYET",
        loaiYeuCau: "TRA",
        keyword: ""
    });
});

test("return approval uses the linked loan and one shared transaction", async () => {
    const calls = [];
    const transaction = { id: "transaction" };
    const request = {
        MaYC: 9,
        MaDG: "DG001",
        MaMT: "MT001",
        LoaiYeuCau: "TRA",
        TrangThai: "CHO_DUYET"
    };
    const repository = {
        async processReturn(requestId, employeeId, returnLoan) {
            calls.push(["process", requestId, employeeId]);
            await returnLoan(request, transaction);
            return { ...request, TrangThai: "DA_DUYET" };
        }
    };
    const loanService = {
        async returnBooks(loanId, returnDate, details, employeeId, connection) {
            calls.push(["return", loanId, returnDate, details, employeeId, connection]);
        }
    };
    const service = new YeuCauMuonTraService(repository, loanService);

    await service.approveReturn(9, {
        NgayTra: "2026-09-09",
        ChiTietTra: []
    }, "NV001");

    assert.deepEqual(calls, [
        ["process", 9, "NV001"],
        ["return", "MT001", "2026-09-09", [], "NV001", transaction]
    ]);
});
