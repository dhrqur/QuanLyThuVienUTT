const assert = require("node:assert/strict");
const test = require("node:test");

const NhanVienRepository = require("../src/models/repositories/nhanvien.repository");
const NhanVienService = require("../src/services/nhanvien.service");

test("login reports an incorrect username", async (t) => {
    t.mock.method(NhanVienRepository, "getByUserWithPassword", async () => undefined);

    await assert.rejects(
        NhanVienService.login({ User: "unknown", Pass: "password" }),
        (error) => error.statusCode === 401 && error.message === "Tên đăng nhập không đúng"
    );
});

test("login reports an incorrect password", async (t) => {
    t.mock.method(NhanVienRepository, "getByUserWithPassword", async () => ({ Pass: "correct-password" }));

    await assert.rejects(
        NhanVienService.login({ User: "known", Pass: "wrong-password" }),
        (error) => error.statusCode === 401 && error.message === "Mật khẩu không đúng"
    );
});
