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
const chitietmuontra = require("./routes/chitietmuontra.routes");
const thongke = require("./routes/thongke.routes");
const { authenticate, requireManager } = require("./middlewares/auth.middleware");
const cors = require("cors");

const app = express();
const swaggerSpec = require("./config/swagger");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "ngrok-skip-browser-warning"]
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/nhanvien", nhanvien);
app.use("/api/sach", authenticate, sach);
app.use("/api/theloai", authenticate, theloai);
app.use("/api/tacgia", authenticate, tacgia);
app.use("/api/nhaxuatban", authenticate, nhaxuatban);
app.use("/api/docgia", authenticate, docgia);
app.use("/api/kesach", authenticate, kesach);
app.use("/api/khoa", authenticate, khoa);
app.use("/api/lop", authenticate, lop);
app.use("/api/ngonngu", authenticate, ngonngu);
app.use("/api/thethuvien", authenticate, thethuvien);
app.use("/api/muontra", authenticate, muontra);
app.use("/api/chitietmuontra", authenticate, chitietmuontra);
app.use("/api/thongke", authenticate, requireManager, thongke);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    db.testConnection();
});
