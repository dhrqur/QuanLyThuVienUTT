const assert = require("node:assert/strict");
const test = require("node:test");
const bcrypt = require("bcrypt");

const {
    DEFAULT_READER_PASSWORD,
    DocGiaAuthService
} = require("../src/services/docgia-auth.service");

function createRepository(reader) {
    return {
        updatedPassword: null,
        async getByIdWithPassword() {
            return reader;
        },
        async updatePassword(maDG, passwordHash) {
            this.updatedPassword = { maDG, passwordHash };
            return true;
        }
    };
}

test("login marks an account that still uses the temporary password", async () => {
    const passwordHash = await bcrypt.hash(DEFAULT_READER_PASSWORD, 4);
    const repository = createRepository({
        MaDG: "DG001",
        TenDG: "Nguyễn An",
        Email: "an@example.com",
        Pass: passwordHash
    });
    const service = new DocGiaAuthService(repository);

    const result = await service.login({
        MaDG: " dg001 ",
        Pass: DEFAULT_READER_PASSWORD
    });

    assert.equal(result.user.MaDG, "DG001");
    assert.equal(result.user.Pass, undefined);
    assert.equal(result.mustChangePassword, true);
    assert.equal(typeof result.token, "string");
});

test("login rejects an invalid password without revealing which credential failed", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 4);
    const service = new DocGiaAuthService(createRepository({
        MaDG: "DG001",
        Pass: passwordHash
    }));

    await assert.rejects(
        service.login({ MaDG: "DG001", Pass: "wrong-password" }),
        (error) => error.statusCode === 401 && /mã độc giả hoặc mật khẩu/i.test(error.message)
    );
});

test("changePassword verifies the old password and stores a bcrypt hash", async () => {
    const passwordHash = await bcrypt.hash(DEFAULT_READER_PASSWORD, 4);
    const repository = createRepository({ MaDG: "DG001", Pass: passwordHash });
    const service = new DocGiaAuthService(repository);

    const result = await service.changePassword("DG001", {
        MatKhauCu: DEFAULT_READER_PASSWORD,
        MatKhauMoi: "new-secure-password"
    });

    assert.equal(result.mustChangePassword, false);
    assert.equal(repository.updatedPassword.maDG, "DG001");
    assert.equal(
        await bcrypt.compare("new-secure-password", repository.updatedPassword.passwordHash),
        true
    );
});

test("changePassword rejects the shared temporary password as a new password", async () => {
    const passwordHash = await bcrypt.hash("current-password", 4);
    const service = new DocGiaAuthService(createRepository({
        MaDG: "DG001",
        Pass: passwordHash
    }));

    await assert.rejects(
        service.changePassword("DG001", {
            MatKhauCu: "current-password",
            MatKhauMoi: DEFAULT_READER_PASSWORD
        }),
        (error) => error.statusCode === 400
    );
});
