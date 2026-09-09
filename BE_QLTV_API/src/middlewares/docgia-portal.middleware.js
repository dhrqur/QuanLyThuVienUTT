const { hasUnexpectedFields, isEmpty } = require("../utils/validation");

function parsePagination(query) {
    const page = query.page === undefined ? 1 : Number(query.page);
    const pageSize = query.pageSize === undefined ? 12 : Number(query.pageSize);

    if (!Number.isInteger(page) || page < 1) return null;
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) return null;

    return { page, pageSize, offset: (page - 1) * pageSize };
}

function validateCatalogQuery(req, res, next) {
    if (hasUnexpectedFields(req.query, ["keyword", "page", "pageSize"])) {
        return res.status(400).json({ message: "Bộ lọc sách có trường không hợp lệ" });
    }

    if (req.query.keyword !== undefined && String(req.query.keyword).trim().length > 100) {
        return res.status(400).json({ message: "Từ khóa không được vượt quá 100 ký tự" });
    }

    const pagination = parsePagination(req.query);
    if (!pagination) {
        return res.status(400).json({ message: "Thông tin phân trang không hợp lệ" });
    }

    req.pagination = pagination;
    next();
}

function validateProfileUpdate(req, res, next) {
    const allowedFields = ["DiaChi", "Email", "Sdt"];
    if (hasUnexpectedFields(req.body, allowedFields)) {
        return res.status(400).json({ message: "Chỉ được cập nhật địa chỉ, email và số điện thoại" });
    }

    if (!Object.keys(req.body || {}).length) {
        return res.status(400).json({ message: "Vui lòng nhập thông tin cần cập nhật" });
    }

    const { DiaChi, Email, Sdt } = req.body;
    if (DiaChi !== undefined && (isEmpty(DiaChi) || String(DiaChi).trim().length > 100)) {
        return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }

    if (Email !== undefined) {
        const email = String(Email).trim();
        if (isEmpty(email) || email.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ" });
        }
    }

    if (Sdt !== undefined && !/^\d{9,13}$/.test(String(Sdt).trim())) {
        return res.status(400).json({ message: "Số điện thoại phải gồm 9 đến 13 chữ số" });
    }

    next();
}

module.exports = { parsePagination, validateCatalogQuery, validateProfileUpdate };

