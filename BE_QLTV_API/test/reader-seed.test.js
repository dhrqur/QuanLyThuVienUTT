const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const bcrypt = require("bcrypt");

test("sample readers receive the documented temporary password hash", async () => {
    const sql = fs.readFileSync(path.join(__dirname, "..", "qltv.sql"), "utf8");
    const hash = sql.match(/SET @docgia_default_password_hash = '([^']+)'/)?.[1];

    assert.ok(hash, "qltv.sql must declare the reader temporary password hash");
    assert.equal(await bcrypt.compare("123456", hash), true);
    assert.equal((sql.match(/@docgia_default_password_hash/g) || []).length, 26);
});

