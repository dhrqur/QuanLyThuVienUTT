const express = require("express");
const swaggerUi = require("swagger-ui-express");
const db = require("./config/db");
const { ensureRuntimeSchema } = require("./config/schema");
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
const nhatkyhethong = require("./routes/nhatkyhethong.routes");
const docgiaAuth = require("./routes/docgia-auth.routes");
const docgiaPortal = require("./routes/docgia-portal.routes");
const yeuCauDocGia = require("./routes/yeucaudocgia.routes");
const { auditActivity } = require("./middlewares/audit.middleware");
const {
    authenticate,
    requireLibraryStaff,
    requireManager,
    requirePasswordChanged,
    requireReader
} = require("./middlewares/auth.middleware");
const cors = require("cors");

const app = express();
const swaggerSpec = require("./config/swagger");

app.disable("x-powered-by");
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
});

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://quan-ly-thu-vien-utt.vercel.app",
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "ngrok-skip-browser-warning"]
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/nhanvien", nhanvien);
app.use("/api/docgia-auth", docgiaAuth);
app.use(
    "/api/docgia-portal",
    authenticate,
    requireReader,
    requirePasswordChanged,
    docgiaPortal
);
app.use("/api", authenticate, requireLibraryStaff, auditActivity);
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
app.use("/api/yeucaudocgia", yeuCauDocGia);
app.use("/api/thongke", requireManager, thongke);
app.use("/api/nhatkyhethong", requireManager, nhatkyhethong);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.testConnection();
        await ensureRuntimeSchema();

        app.listen(PORT, () => {
            console.log(`Server dang chay tai http://localhost:${PORT}`);
            console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Khong the khoi dong server:", error.message);
        process.exitCode = 1;
    }
}

void startServer();
