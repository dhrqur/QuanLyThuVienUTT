const path = require("node:path");

const db = require("../src/config/db");
const {
    createQrAsset,
    deleteQrAsset,
    getQrImageUrl,
    readQrAsset
} = require("../src/services/qr-asset.service");

const storageRoot = path.resolve(__dirname, "..");
const targets = [
    { assetType: "book", table: "sach", identifierColumn: "MaSach" },
    { assetType: "card", table: "thethuvien", identifierColumn: "MaThe" }
];

async function backfillTarget({ assetType, table, identifierColumn }) {
    const [rows] = await db.query(`
        SELECT \`${identifierColumn}\` AS Identifier, QrImageUrl
        FROM \`${table}\`
        ORDER BY \`${identifierColumn}\`
    `);

    const result = {
        total: rows.length,
        imagesCreated: 0,
        urlsUpdated: 0
    };

    for (const row of rows) {
        const identifier = row.Identifier;
        const expectedUrl = getQrImageUrl(assetType, identifier);
        const image = await readQrAsset(assetType, identifier, { storageRoot });
        const imageWasCreated = !image;

        try {
            if (imageWasCreated) {
                await createQrAsset(assetType, identifier, { storageRoot });
                result.imagesCreated += 1;
            }

            if (row.QrImageUrl !== expectedUrl) {
                const [updateResult] = await db.query(
                    `UPDATE \`${table}\`
                     SET QrImageUrl = ?
                     WHERE \`${identifierColumn}\` = ?
                       AND (QrImageUrl IS NULL OR QrImageUrl <> ?)`,
                    [expectedUrl, identifier, expectedUrl]
                );

                if (updateResult.affectedRows === 0) {
                    throw new Error(`Không tìm thấy ${identifier} để lưu URL QR`);
                }

                result.urlsUpdated += 1;
            }
        } catch (error) {
            if (imageWasCreated) {
                await deleteQrAsset(assetType, identifier, { storageRoot }).catch(() => {});
            }

            throw error;
        }
    }

    return result;
}

async function backfill() {
    try {
        for (const target of targets) {
            const result = await backfillTarget(target);
            console.log(`${target.assetType}: ${result.total} bản ghi, tạo ${result.imagesCreated} ảnh, cập nhật ${result.urlsUpdated} URL`);
        }
    } catch (error) {
        console.error("Backfill ảnh QR thất bại:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

void backfill();
