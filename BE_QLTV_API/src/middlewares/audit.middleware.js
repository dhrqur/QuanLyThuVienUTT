const NhatKyHeThongService = require("../services/nhatkyhethong.service");

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SENSITIVE_FIELDS = new Set([
    "pass", "password", "matkhau", "token", "authorization", "authsecret"
]);
const ENTITY_CONFIG = {
    sach: { label: "Sách", idKey: "MaSach", nameKeys: ["TenSach"] },
    theloai: { label: "Thể loại", idKey: "MaTL", nameKeys: ["TenTL"] },
    tacgia: { label: "Tác giả", idKey: "MaTG", nameKeys: ["TenTG"] },
    nhaxuatban: { label: "Nhà xuất bản", idKey: "MaNXB", nameKeys: ["TenNXB"] },
    docgia: { label: "Độc giả", idKey: "MaDG", nameKeys: ["TenDG"] },
    kesach: { label: "Kệ sách", idKey: "MaViTri", nameKeys: ["TenKe"] },
    khoa: { label: "Khoa", idKey: "MaKhoa", nameKeys: ["TenKhoa"] },
    lop: { label: "Lớp", idKey: "MaLop", nameKeys: ["TenLop"] },
    ngonngu: { label: "Ngôn ngữ", idKey: "MaNN", nameKeys: ["TenNN"] },
    thethuvien: { label: "Thẻ thư viện", idKey: "MaThe", nameKeys: ["TenDG"] },
    muontra: { label: "Phiếu mượn trả", idKey: "MaMT", nameKeys: ["TenDG"] },
    xulyvipham: { label: "Vi phạm", idKey: "MaVP", nameKeys: ["TenSach", "TenDG"] },
    quydinhthuvien: { label: "Quy định thư viện", idKey: "MaQD", nameKeys: [] },
    nhanvien: { label: "Nhân viên", idKey: "MaNV", nameKeys: ["TenNV"] }
};
const ACTION_LABELS = {
    THEM: "Thêm",
    CAP_NHAT: "Cập nhật",
    XOA: "Xóa",
    TRA_SACH: "Trả sách và thu tiền",
    XU_LY_VI_PHAM: "Xử lý vi phạm",
    CAP_NHAT_QUY_DINH: "Cập nhật quy định"
};

function auditActivity(req, res, next) {
    if (!MUTATION_METHODS.has(req.method)) return next();

    let responseBody;
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        responseBody = body;
        return originalJson(body);
    };

    res.once("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) return;

        const pathParts = req.originalUrl.split("?")[0].split("/").filter(Boolean);
        const apiIndex = pathParts.indexOf("api");
        const moduleName = pathParts[apiIndex + 1];
        const config = ENTITY_CONFIG[moduleName];
        if (!config) return;

        const action = getAction(req.method, moduleName, pathParts);
        const requestData = sanitize(req.body);
        const resultData = sanitize(responseBody?.data);
        const entityId = getEntityId({ config, pathParts, apiIndex, requestData, resultData });
        const entityName = getEntityName(config, requestData, resultData);
        const description = `${ACTION_LABELS[action]} ${config.label.toLowerCase()}${entityName || entityId ? ` ${entityName || entityId}` : ""}`;

        void NhatKyHeThongService.create({
            MaNV: req.user?.id || null,
            TenDangNhap: req.user?.username || null,
            VaiTro: req.user?.role || null,
            HanhDong: action,
            DoiTuong: config.label,
            MaDoiTuong: entityId,
            MoTa: description,
            PhuongThuc: req.method,
            DuongDan: req.originalUrl.split("?")[0],
            DuLieuYeuCau: requestData,
            DuLieuKetQua: resultData,
            DiaChiIP: req.ip || req.socket?.remoteAddress || null,
            UserAgent: req.get("user-agent") || null
        }).catch((error) => {
            console.error("Khong the ghi nhat ky he thong:", error.message);
        });
    });

    next();
}

function getAction(method, moduleName, pathParts) {
    if (moduleName === "muontra" && pathParts.includes("tra-sach")) return "TRA_SACH";
    if (moduleName === "xulyvipham" && method === "PUT") return "XU_LY_VI_PHAM";
    if (moduleName === "quydinhthuvien" && method === "PUT") return "CAP_NHAT_QUY_DINH";
    if (method === "POST") return "THEM";
    if (method === "DELETE") return "XOA";
    return "CAP_NHAT";
}

function getEntityName(config, requestData, resultData) {
    for (const key of config.nameKeys) {
        const value = resultData?.[key] ?? requestData?.[key];
        if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return null;
}

function getEntityId({ config, pathParts, apiIndex, requestData, resultData }) {
    const routeId = pathParts[apiIndex + 2];
    if (routeId && !["tra-sach", "dang-xuat"].includes(routeId)) {
        try {
            return decodeURIComponent(routeId);
        } catch {
            return routeId;
        }
    }

    return resultData?.[config.idKey] ?? requestData?.[config.idKey] ?? null;
}

function sanitize(value, seen = new WeakSet()) {
    if (value === null || value === undefined) return null;
    if (typeof value !== "object") return value;
    if (seen.has(value)) return "[Circular]";
    seen.add(value);

    if (Array.isArray(value)) return value.map((item) => sanitize(item, seen));

    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
        key,
        SENSITIVE_FIELDS.has(normalizeKey(key)) ? "[ĐÃ ẨN]" : sanitize(item, seen)
    ]));
}

function normalizeKey(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

module.exports = { auditActivity };
