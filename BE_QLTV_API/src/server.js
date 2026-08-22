const express = require("express");
const swaggerUi = require("swagger-ui-express");
const db = require("./config/db");
const sach = require("./routes/sach.routes");
const nhanvien = require("./routes/nhanvien.routes");
const theloai = require("./routes/theloai.routes");
const tacgia = require("./routes/tacgia.routes");
const nhaxuatban = require("./routes/nhaxuatban.routes");
const docgia = require("./routes/docgia.routes");
const kesach = require("./routes/kesach.routes");
const khoa = require("./routes/khoa.routes");
const lop = require("./routes/lop.routes");
const ngonngu = require("./routes/ngonngu.routes");
const thethuvien = require("./routes/thethuvien.routes");
const muontra = require("./routes/muontra.routes");
const thongke = require("./routes/thongke.routes");
const xulyvipham = require("./routes/xulyvipham.routes");
const quydinhthuvien = require("./routes/quydinhthuvien.routes");
const {
    authenticate,
    requireLibraryStaff,
    requireManager
} = require("./middlewares/auth.middleware");
const cors = require("cors");

const app = express();
const swaggerSpec = require("./config/swagger");

const allowedOrigins = new Set([
    "http://localhost:5173",
    "https://quan-ly-thu-vien-utt-4b2b.vercel.app",
    ...(process.env.CLIENT_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
]);

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header (for example server-to-server calls)
        // are not subject to browser CORS checks.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "ngrok-skip-browser-warning"]
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/nhanvien", nhanvien);
app.use("/api", authenticate, requireLibraryStaff);
app.use("/api/sach", sach);
app.use("/api/theloai", theloai);
app.use("/api/tacgia", tacgia);
app.use("/api/nhaxuatban", nhaxuatban);
app.use("/api/docgia", docgia);
app.use("/api/kesach", kesach);
app.use("/api/khoa", khoa);
app.use("/api/lop", lop);
app.use("/api/ngonngu", ngonngu);
app.use("/api/thethuvien", thethuvien);
app.use("/api/muontra", muontra);
app.use("/api/xulyvipham", xulyvipham);
app.use("/api/quydinhthuvien", quydinhthuvien);
app.use("/api/thongke", requireManager, thongke);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    db.testConnection();
});
