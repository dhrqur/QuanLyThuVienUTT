const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 10;

function createLoginRateLimiter({
    maxFailures = MAX_LOGIN_FAILURES,
    windowMs = LOGIN_WINDOW_MS,
    maxTrackedKeys = 5000,
    now = Date.now
} = {}) {
    const failures = new Map();

    return function limitReaderLogin(req, res, next) {
        const timestamp = now();
        const readerId = String(req.body?.MaDG || "").trim().toUpperCase();
        const key = `${req.ip || "unknown"}:${readerId}`;
        let record = failures.get(key);

        if (record && timestamp - record.startedAt >= windowMs) {
            failures.delete(key);
            record = null;
        }

        if (record?.count >= maxFailures) {
            return res.status(429).json({
                message: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau."
            });
        }

        res.once("finish", () => {
            if (res.statusCode < 400) {
                failures.delete(key);
                return;
            }

            const currentTime = now();
            const current = failures.get(key);
            if (!current || currentTime - current.startedAt >= windowMs) {
                if (!current && failures.size >= maxTrackedKeys) {
                    failures.delete(failures.keys().next().value);
                }
                failures.set(key, { count: 1, startedAt: currentTime });
                return;
            }
            current.count += 1;
        });

        next();
    };
}

module.exports = {
    createLoginRateLimiter,
    limitReaderLogin: createLoginRateLimiter()
};
