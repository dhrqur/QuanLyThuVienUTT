const crypto = require("crypto");

const TOKEN_TTL_SECONDS = 8 * 60 * 60;
const SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString("base64url");

function base64url(value) {
    return Buffer.from(value).toString("base64url");
}

function sign(value) {
    return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

function normalizeRole(role) {
    return String(role || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function createAccessToken(employee) {
    const payload = base64url(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
        id: employee.MaNV,
        role: employee.VaiTro,
        username: employee.User
    }));
    return `${payload}.${sign(payload)}`;
}

function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Vui long dang nhap de tiep tuc" });

    const [payload, signature] = token.split(".");
    const expectedSignature = sign(payload || "");
    if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return res.status(401).json({ message: "Phien dang nhap khong hop le" });
    }

    try {
        const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!user.exp || user.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ message: "Phien dang nhap da het han" });
        }
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Phien dang nhap khong hop le" });
    }
}

function requireManager(req, res, next) {
    if (normalizeRole(req.user?.role) !== "quan ly") {
        return res.status(403).json({ message: "Ban khong co quyen truy cap chuc nang nay" });
    }
    next();
}

module.exports = { authenticate, createAccessToken, requireManager };
