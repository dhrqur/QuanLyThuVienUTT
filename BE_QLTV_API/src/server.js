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
const cors = require("cors");
const { authenticate, requireManager } = require("./middlewares/auth.middleware");

const app = express();
const swaggerSpec = require("./config/swagger");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/nhanvien", nhanvien);
app.use(authenticate);
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
app.use("/api/chitietmuontra", chitietmuontra);
app.use("/api/thongke", requireManager, thongke);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    db.testConnection();
});
