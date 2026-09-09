const assert = require("node:assert/strict");
const test = require("node:test");

const {
    authenticate,
    createReaderAccessToken,
    requirePasswordChanged,
    requireReader
} = require("../src/middlewares/auth.middleware");

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

test("reader token is authenticated with reader identity and role", () => {
    const token = createReaderAccessToken({
        MaDG: "DG001",
        mustChangePassword: false
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    let authenticated = false;

    authenticate(req, res, () => {
        authenticated = true;
    });

    assert.equal(authenticated, true);
    assert.deepEqual(req.user, {
        id: "DG001",
        role: "Doc gia",
        username: "DG001",
        mustChangePassword: false
    });
});

test("reader authorization rejects an employee token payload", () => {
    const req = { user: { id: "NV001", role: "Thu thu" } };
    const res = createResponse();
    let authorized = false;

    requireReader(req, res, () => {
        authorized = true;
    });

    assert.equal(authorized, false);
    assert.equal(res.statusCode, 403);
});

test("temporary-password middleware only allows password-change access", () => {
    const req = { user: { id: "DG001", role: "Doc gia", mustChangePassword: true } };
    const res = createResponse();
    let continued = false;

    requirePasswordChanged(req, res, () => {
        continued = true;
    });

    assert.equal(continued, false);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.code, "PASSWORD_CHANGE_REQUIRED");
});

