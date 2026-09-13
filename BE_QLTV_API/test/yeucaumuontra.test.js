const assert = require("node:assert/strict");
const test = require("node:test");

const { buildNextLoanId } = require("../src/models/repositories/yeucaumuontra.repository");
const {
    validateCreateRequest,
    validateRejectRequest,
    validateRequestList
} = require("../src/middlewares/yeucaumuontra.middleware");

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

test("borrow request loan id continues the existing MT sequence", () => {
    assert.equal(buildNextLoanId([]), "MT001");
    assert.equal(buildNextLoanId(["MT001", "MT025", "MTY0000042"]), "MT026");
    assert.equal(buildNextLoanId(["MT998", "MT999"]), "MT1000");
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

test("return request is rejected", () => {
    const req = { body: { LoaiYeuCau: "TRA", MaMT: "MT001" } };
    const res = createResponse();

    validateCreateRequest(req, res, () => assert.fail("must reject return requests"));

    assert.equal(res.statusCode, 400);
});

test("rejection requires a meaningful reason", () => {
    const req = { body: { LyDoTuChoi: "  " } };
    const res = createResponse();

    validateRejectRequest(req, res, () => assert.fail("must require reason"));

    assert.equal(res.statusCode, 400);
});

test("request filters are normalized without mutating Express query", () => {
    const query = Object.freeze({ trangThai: "cho_duyet" });
    const req = { query };
    const res = createResponse();

    validateRequestList(req, res, () => {});

    assert.equal(req.query, query);
    assert.deepEqual(req.requestFilters, {
        trangThai: "CHO_DUYET",
        keyword: ""
    });
});
