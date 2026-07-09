const crypto = require("crypto");

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "qltv-development-secret";
const TOKEN_EXPIRES_IN_SECONDS = Number(process.env.AUTH_TOKEN_EXPIRES_IN_SECONDS || 8 * 60 * 60);

function base64UrlEncode(value) {
    return Buffer.from(JSON.stringify(value))
        .toString("base64url");
}

function base64UrlDecode(value) {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signValue(value) {
    return crypto
        .createHmac("sha256", TOKEN_SECRET)
        .update(value)
        .digest("base64url");
}

function createToken(payload) {
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
    const body = base64UrlEncode({
        ...payload,
        iat: now,
        exp: now + TOKEN_EXPIRES_IN_SECONDS
    });
    const signature = signValue(`${header}.${body}`);

    return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
    const parts = String(token || "").split(".");

    if (parts.length !== 3) {
        throw new Error("Token khong hop le");
    }

    const [header, body, signature] = parts;
    const expectedSignature = signValue(`${header}.${body}`);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedSignatureBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
        throw new Error("Token khong hop le");
    }

    const payload = base64UrlDecode(body);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
        throw new Error("Token da het han");
    }

    return payload;
}

module.exports = {
    createToken,
    verifyToken
};
