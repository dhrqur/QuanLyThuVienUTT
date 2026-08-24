const jwt = require("jsonwebtoken");
const { normalizeText } = require("../utils/validation");

const TOKEN_TTL = "8h";
const JWT_ISSUER = "quan-ly-thu-vien-utt";
const JWT_AUDIENCE = "quan-ly-thu-vien-utt-api";
const SECRET = process.env.AUTH_SECRET || "development-only-change-this-auth-secret";

if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required in production");
}

function createAccessToken(employee) {
    return jwt.sign({
        role: employee.VaiTro,
        username: employee.User
    }, SECRET, {
        subject: String(employee.MaNV),
        expiresIn: TOKEN_TTL,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE
    });
}

function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Vui long dang nhap de tiep tuc" });

    try {
        const payload = jwt.verify(token, SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE
        });
        req.user = {
            id: payload.sub,
            role: payload.role,
            username: payload.username
        };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Phien dang nhap da het han" });
        }
        return res.status(401).json({ message: "Phien dang nhap khong hop le" });
    }
}

function authorizeRoles(...roles) {
    const allowedRoles = new Set(roles.map(normalizeText));

    return (req, res, next) => {
        if (!allowedRoles.has(normalizeText(req.user?.role))) {
            return res.status(403).json({ message: "Ban khong co quyen truy cap chuc nang nay" });
        }
        next();
    };
}

const requireManager = authorizeRoles("Quan ly");
const requireLibraryStaff = authorizeRoles("Quan ly", "Thu thu");

module.exports = {
    authenticate,
    authorizeRoles,
    createAccessToken,
    requireLibraryStaff,
    requireManager
};
