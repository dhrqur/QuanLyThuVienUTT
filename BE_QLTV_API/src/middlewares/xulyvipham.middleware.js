const STATUSES = new Set(["CHUA_THU", "DA_THU", "MIEN_PHAT"]);
function validateSearch(req, res, next) {
    if (!String(req.query.keyword || "").trim()) return res.status(400).json({ message: "Vui long nhap tu khoa" });
    next();
}
function validateUpdate(req, res, next) {
    const allowed = ["MaVP", "MaMT", "MaDG", "TenDG", "MaSach", "TenSach", "LoaiViPham", "SoLuong", "SoTien", "MoTa", "TrangThaiThu", "NgayLap", "NgayThu", "MaNVThu", "TenNVThu"];
    if (Object.keys(req.body).some((key) => !allowed.includes(key))) return res.status(400).json({ message: "Du lieu vi pham co truong khong hop le" });
    if (!STATUSES.has(req.body.TrangThaiThu)) return res.status(400).json({ message: "Trang thai thu khong hop le" });
    next();
}
module.exports = { validateSearch, validateUpdate };
