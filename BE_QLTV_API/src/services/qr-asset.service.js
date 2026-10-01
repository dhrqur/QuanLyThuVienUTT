const fs = require("node:fs/promises");
const path = require("node:path");
const QRCode = require("qrcode");

const QR_ASSET_TYPES = {
    book: {
        directoryName: "qr-books",
        payloadType: "BOOK",
        route: "sach"
    },
    card: {
        directoryName: "qr-cards",
        payloadType: "CARD",
        route: "thethuvien"
    }
};

const IDENTIFIER_PATTERN = /^[a-zA-Z0-9_-]{1,10}$/;

function getAssetType(assetType) {
    const definition = QR_ASSET_TYPES[assetType];

    if (!definition) {
        throw new Error("Loại mã QR không hợp lệ");
    }

    return definition;
}

function normalizeIdentifier(identifier) {
    const value = String(identifier ?? "").trim();

    if (!IDENTIFIER_PATTERN.test(value)) {
        throw new Error("Mã QR không hợp lệ");
    }

    return value;
}

function getQrPayload(assetType, identifier) {
    const definition = getAssetType(assetType);
    const normalizedIdentifier = normalizeIdentifier(identifier);

    return `UTT:${definition.payloadType}:${normalizedIdentifier}`;
}

function getQrImageUrl(assetType, identifier) {
    const definition = getAssetType(assetType);
    const normalizedIdentifier = normalizeIdentifier(identifier);

    return `/api/${definition.route}/${encodeURIComponent(normalizedIdentifier)}/qr`;
}

function getQrFilePath(assetType, identifier, storageRoot = process.cwd()) {
    const definition = getAssetType(assetType);
    const normalizedIdentifier = normalizeIdentifier(identifier);
    const assetDirectory = path.resolve(storageRoot, "uploads", definition.directoryName);
    const filePath = path.resolve(assetDirectory, `${normalizedIdentifier}.png`);

    if (path.dirname(filePath) !== assetDirectory) {
        throw new Error("Đường dẫn mã QR không hợp lệ");
    }

    return filePath;
}

async function createQrAsset(assetType, identifier, { storageRoot = process.cwd() } = {}) {
    const filePath = getQrFilePath(assetType, identifier, storageRoot);
    const payload = getQrPayload(assetType, identifier);

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    try {
        await QRCode.toFile(filePath, payload, {
            errorCorrectionLevel: "M",
            margin: 2,
            type: "png",
            width: 256
        });
    } catch (error) {
        await fs.rm(filePath, { force: true }).catch(() => {});
        throw error;
    }

    return {
        filePath,
        QrImageUrl: getQrImageUrl(assetType, identifier)
    };
}

async function readQrAsset(assetType, identifier, { storageRoot = process.cwd() } = {}) {
    const filePath = getQrFilePath(assetType, identifier, storageRoot);

    try {
        return await fs.readFile(filePath);
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }

        throw error;
    }
}

async function deleteQrAsset(assetType, identifier, { storageRoot = process.cwd() } = {}) {
    const filePath = getQrFilePath(assetType, identifier, storageRoot);

    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        if (error.code === "ENOENT") {
            return false;
        }

        throw error;
    }
}

module.exports = {
    createQrAsset,
    deleteQrAsset,
    getQrImageUrl,
    getQrPayload,
    readQrAsset
};
