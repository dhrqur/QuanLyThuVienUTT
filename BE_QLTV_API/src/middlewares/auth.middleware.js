const { verifyToken } = require("../config/auth");

function normalizeRole(role) {
    return String(role || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/Ä‘/gi, "d")
        .trim()
        .toLowerCase();
}

function isManagerRole(role) {
    const normalizedRole = normalizeRole(role);
    return normalizedRole === "quan ly" ||
        normalizedRole === "quan ly thu vien" ||
        normalizedRole === "admin";
}

function authenticate(req, res, next) {
    const authorization = req.headers.authorization || "";
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Vui long dang nhap de tiep tuc"
        });
    }

    try {
        req.user = verifyToken(token);
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || "Phien dang nhap khong hop le"
        });
    }
}

function requireManager(req, res, next) {
    if (!isManagerRole(req.user?.VaiTro)) {
        return res.status(403).json({
            success: false,
            message: "Ban khong co quyen thuc hien chuc nang nay"
        });
    }

    return next();
}

module.exports = {
    authenticate,
    requireManager
};
