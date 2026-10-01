const db = require("../../src/config/db");

const targets = [
    { column: "QrImageUrl", table: "sach" },
    { column: "QrImageUrl", table: "thethuvien" }
];

async function hasColumn(table, column) {
    const [rows] = await db.query(`
        SELECT COLUMN_NAME
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = ?
          AND column_name = ?
    `, [table, column]);

    return rows.length > 0;
}

async function addQrImageUrlColumn({ table, column }) {
    if (await hasColumn(table, column)) {
        return;
    }

    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` varchar(255) NULL`);
}

async function migrate() {
    try {
        for (const target of targets) {
            await addQrImageUrlColumn(target);
        }

        console.log("Migration lưu URL ảnh QR hoàn tất");
    } catch (error) {
        console.error("Migration lưu URL ảnh QR thất bại:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

void migrate();
