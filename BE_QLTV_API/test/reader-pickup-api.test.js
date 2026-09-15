const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const service = require("../src/services/yeucaumuontra.service");
const router = require("../src/routes/yeucaudocgia.routes");
const { authenticate, requireLibraryStaff, createAccessToken, createReaderAccessToken } = require("../src/middlewares/auth.middleware");

test("staff HTTP approval and pickup enforce roles, input and authenticated employee", async (t) => {
    const app = express();
    app.use(express.json());
    app.use("/requests", authenticate, requireLibraryStaff, router);
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const calls = [];
    t.mock.method(service, "approveBorrow", async (...args) => {
        calls.push(["approve", ...args]);
        return { MaYC: args[0], TrangThai: "DA_DUYET", MaMT: null };
    });
    t.mock.method(service, "confirmPickup", async (...args) => {
        calls.push(["pickup", ...args]);
        return { MaYC: args[0], TrangThai: "DA_LAY", MaMT: "MTY0000001" };
    });
    const base = `http://127.0.0.1:${server.address().port}/requests/1`;
    const staff = createAccessToken({ MaNV: "NV001", VaiTro: "Thu thu", User: "test" });
    const manager = createAccessToken({ MaNV: "NV002", VaiTro: "Quan ly", User: "test" });
    const reader = createReaderAccessToken({ MaDG: "DG001" });
    async function put(path, token, body = {}) {
        return fetch(base + path, { method: "PUT", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
    }
    assert.equal((await put("/da-lay")).status, 401);
    assert.equal((await put("/da-lay", reader)).status, 403);
    assert.equal((await put("/da-lay", staff)).status, 400);
    assert.equal((await put("/da-lay", staff, { HanTra: "2099-01-01", MaNV: "NV999" })).status, 400);
    const approval = await put("/duyet-muon", staff);
    assert.equal(approval.status, 200);
    assert.equal((await approval.json()).data.MaMT, null);
    const pickup = await put("/da-lay", manager, { HanTra: "2099-01-01" });
    assert.equal(pickup.status, 200);
    assert.equal((await pickup.json()).data.TrangThai, "DA_LAY");
    assert.deepEqual(calls, [["approve", 1, "NV001"], ["pickup", 1, "2099-01-01", "NV002"]]);
});
