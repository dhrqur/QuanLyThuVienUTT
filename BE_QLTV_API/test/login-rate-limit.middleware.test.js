const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const test = require("node:test");

const { createLoginRateLimiter } = require("../src/middlewares/login-rate-limit.middleware");

function response() {
    const res = new EventEmitter();
    res.statusCode = 200;
    res.status = function status(code) { this.statusCode = code; return this; };
    res.json = function json(body) { this.body = body; return this; };
    return res;
}

test("reader login limiter blocks repeated failed attempts and resets after window", () => {
    let now = 1_000;
    const limiter = createLoginRateLimiter({ maxFailures: 2, windowMs: 500, now: () => now });
    const request = { ip: "127.0.0.1", body: { MaDG: "DG001" } };

    for (let attempt = 0; attempt < 2; attempt += 1) {
        const res = response();
        limiter(request, res, () => { res.statusCode = 401; });
        res.emit("finish");
    }

    const blocked = response();
    limiter(request, blocked, () => assert.fail("must block"));
    assert.equal(blocked.statusCode, 429);

    now += 501;
    limiter(request, response(), () => {});
});

test("successful login clears previous failures", () => {
    const limiter = createLoginRateLimiter({ maxFailures: 1, windowMs: 500, now: () => 1_000 });
    const request = { ip: "127.0.0.1", body: { MaDG: "DG001" } };
    const success = response();

    limiter(request, success, () => {});
    success.emit("finish");

    limiter(request, response(), () => {});
});
