const db = require("../../src/config/db");
const { ensureReaderRequestTables } = require("../../src/config/schema");

async function migrate() {
    try {
        await ensureReaderRequestTables();
        console.log("Migration bảng yêu cầu mượn trả hoàn tất");
    } catch (error) {
        const details = error.errors?.map((item) => item.message).filter(Boolean).join("; ");
        console.error("Migration bảng yêu cầu mượn trả thất bại:", details || error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

void migrate();

