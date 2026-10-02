const assert = require("node:assert/strict");
const test = require("node:test");

const db = require("../src/config/db");
const repository = require("../src/models/repositories/thethuvien.repository");

test("library-card search includes the reader name", async (t) => {
    const queries = [];
    t.mock.method(db, "query", async (sql, values) => {
        queries.push({ sql, values });
        return [[]];
    });

    await repository.search("Nguyen An");

    assert.equal(queries.length, 2);
    assert.match(queries[1].sql, /LEFT JOIN docgia dg ON dg\.MaDG = ttv\.MaDG/);
    assert.match(queries[1].sql, /OR dg\.TenDG LIKE \?/);
    assert.deepEqual(queries[1].values, Array(6).fill("%Nguyen An%"));
});
