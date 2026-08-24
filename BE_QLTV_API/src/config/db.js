require("dotenv").config({ quiet: true });
const mysql = require("mysql2/promise");
const useSsl = process.env.DB_SSL === "true";
const sslCa = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "qltv",
    port: Number(process.env.DB_PORT || 3306),
    // DATE is a calendar value, not a point in time. Returning it as a string
    // prevents JSON serialization from shifting it back one day in UTC.
    dateStrings: ["DATE"],
    ssl: useSsl ? {
        ca: sslCa,
        rejectUnauthorized: Boolean(sslCa)
    } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("Ket noi MySQL thanh cong");
        connection.release();
    } catch (error) {
        console.log("Ket noi MySQL that bai:", error.message);
        throw error;
    }
}

db.testConnection = testConnection;

module.exports = db;
