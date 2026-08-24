const db = require("../../src/config/db");

const tables = ["docgia", "nhanvien", "nhaxuatban"];
const constraints = [
    ["docgia", "uq_docgia_email", "Email"],
    ["docgia", "uq_docgia_sdt", "Sdt"],
    ["nhanvien", "uq_nhanvien_email", "Email"],
    ["nhanvien", "uq_nhanvien_sdt", "Sdt"],
    ["nhaxuatban", "uq_nhaxuatban_email", "Email"],
    ["nhaxuatban", "uq_nhaxuatban_sdt", "Sdt"]
];

async function assertNoDuplicates(table, column, normalizedExpression) {
    const [duplicates] = await db.query(`
        SELECT ${normalizedExpression} AS value, COUNT(*) AS total
        FROM \`${table}\`
        WHERE \`${column}\` IS NOT NULL AND TRIM(\`${column}\`) <> ''
        GROUP BY ${normalizedExpression}
        HAVING COUNT(*) > 1
        LIMIT 1
    `);

    if (duplicates.length) {
        throw new Error(
            `Khong the tao rang buoc UNIQUE: ${table}.${column} dang co du lieu trung.`
        );
    }
}

async function addConstraint(table, indexName, column) {
    const [existing] = await db.query(
        `SELECT 1
         FROM information_schema.statistics
         WHERE table_schema = DATABASE()
           AND table_name = ?
           AND index_name = ?
         LIMIT 1`,
        [table, indexName]
    );

    if (existing.length) {
        console.log(`Da ton tai ${indexName}`);
        return;
    }

    await db.query(
        `ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${indexName}\` (\`${column}\`)`
    );
    console.log(`Da them ${indexName}`);
}

async function migrate() {
    for (const table of tables) {
        await assertNoDuplicates(table, "Email", "LOWER(TRIM(`Email`))");
        await assertNoDuplicates(table, "Sdt", "TRIM(`Sdt`)");
    }

    for (const table of tables) {
        await db.query(`UPDATE \`${table}\` SET Email = LOWER(TRIM(Email))`);
        await db.query(`UPDATE \`${table}\` SET Sdt = TRIM(Sdt) WHERE Sdt IS NOT NULL`);
    }

    await db.query("UPDATE nhaxuatban SET Sdt = NULL WHERE Sdt = ''");

    for (const constraint of constraints) {
        await addConstraint(...constraint);
    }
}

migrate()
    .then(() => console.log("Da cap nhat rang buoc trung email va so dien thoai."))
    .catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(() => db.end());
