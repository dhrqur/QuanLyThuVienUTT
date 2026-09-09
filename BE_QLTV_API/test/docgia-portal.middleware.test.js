const assert = require("node:assert/strict");
const test = require("node:test");

const {
    parsePagination,
    validateCatalogQuery,
    validateProfileUpdate
} = require("../src/middlewares/docgia-portal.middleware");

function createResponse() {
    return {
        body: null,
        statusCode: 200,
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

test("profile update rejects identity fields", () => {
    const req = {
        body: {
            MaDG: "DG002",
            DiaChi: "Hà Nội",
            Email: "an@example.com",
            Sdt: "0912345678"
        }
    };
    const res = createResponse();

    validateProfileUpdate(req, res, () => assert.fail("must reject MaDG"));

    assert.equal(res.statusCode, 400);
});

test("catalog pagination has safe defaults and a maximum page size", () => {
    assert.deepEqual(parsePagination({}), { page: 1, pageSize: 12, offset: 0 });
    assert.deepEqual(parsePagination({ page: "3", pageSize: "50" }), {
        page: 3,
        pageSize: 50,
        offset: 100
    });
    assert.equal(parsePagination({ pageSize: "500" }), null);
});

test("catalog query rejects unsupported filters", () => {
    const req = { query: { MaDG: "DG002" } };
    const res = createResponse();

    validateCatalogQuery(req, res, () => assert.fail("must reject unsupported query"));

    assert.equal(res.statusCode, 400);
});

