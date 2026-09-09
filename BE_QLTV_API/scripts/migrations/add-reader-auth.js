const bcrypt = require("bcrypt");

const db = require("../../src/config/db");

const BCRYPT_ROUNDS = 12;
const DEFAULT_READER_PASSWORD = "123456";

async function hasPasswordColumn() {
    const [rows] = await db.query(`
        SELECT COLUMN_NAME
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'docgia'
          AND column_name = 'Pass'
    `);
    return rows.length > 0;
}

async function addPasswordColumn() {
    if (!await hasPasswordColumn()) {
        await db.query("ALTER TABLE docgia ADD COLUMN Pass varchar(255) NULL AFTER Sdt");
    }
}

async function backfillMissingPasswords() {
    const [readers] = await db.query(
        "SELECT MaDG FROM docgia WHERE Pass IS NULL OR TRIM(Pass) = ''"
    );

    for (const reader of readers) {
        const passwordHash = await bcrypt.hash(DEFAULT_READER_PASSWORD, BCRYPT_ROUNDS);
        await db.query(
            "UPDATE docgia SET Pass = ? WHERE MaDG = ? AND (Pass IS NULL OR TRIM(Pass) = '')",
            [passwordHash, reader.MaDG]
        );
    }
}

async function requirePasswordValue() {
    const [rows] = await db.query(`
        SELECT IS_NULLABLE
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'docgia'
          AND column_name = 'Pass'
    `);

    if (rows[0]?.IS_NULLABLE === "YES") {
        await db.query("ALTER TABLE docgia MODIFY COLUMN Pass varchar(255) NOT NULL");
    }
}

async function migrate() {
    try {
        await addPasswordColumn();
        await backfillMissingPasswords();
        await requirePasswordValue();
        console.log("Migration tài khoản độc giả hoàn tất");
    } catch (error) {
        const details = error.errors?.map((item) => item.message).filter(Boolean).join("; ");
        console.error("Migration tài khoản độc giả thất bại:", details || error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

void migrate();
