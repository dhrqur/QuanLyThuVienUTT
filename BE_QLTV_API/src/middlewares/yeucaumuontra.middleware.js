const { getCurrentDate } = require("../utils/date");
const { hasUnexpectedFields, isEmpty, trimText } = require("../utils/validation");

function validateBorrowDetails(details, res) {
    if (!Array.isArray(details) || !details.length) {
        return res.status(400).json({ message: "Vui lòng chọn ít nhất một sách" });
    }
    if (details.length > 50) {
        return res.status(400).json({ message: "Mỗi yêu cầu chỉ được chọn tối đa 50 đầu sách" });
    }

    const bookIds = new Set();
    for (const detail of details) {
        if (!detail || hasUnexpectedFields(detail, ["MaSach", "SoLuong"])) {
            return res.status(400).json({ message: "Chi tiết yêu cầu mượn không hợp lệ" });
        }

        const bookId = trimText(detail.MaSach);
        const quantity = Number(detail.SoLuong);
        if (!bookId || bookId.length > 10 || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Mã sách hoặc số lượng không hợp lệ" });
        }

        if (bookIds.has(bookId)) {
            return res.status(400).json({ message: "Không được chọn trùng sách" });
        }
        bookIds.add(bookId);
    }

    return null;
}

function validateCreateRequest(req, res, next) {
    if (hasUnexpectedFields(req.body, ["LoaiYeuCau", "ChiTiet"])) {
        return res.status(400).json({ message: "Dữ liệu yêu cầu có trường không hợp lệ" });
    }

    const type = trimText(req.body.LoaiYeuCau).toUpperCase();
    if (type !== "MUON") return res.status(400).json({ message: "Chỉ hỗ trợ yêu cầu mượn sách" });

    const error = validateBorrowDetails(req.body.ChiTiet, res);
    if (error) return error;

    req.body.LoaiYeuCau = type;
    next();
}

function validateRequestList(req, res, next) {
    if (hasUnexpectedFields(req.query, ["trangThai", "keyword"])) {
        return res.status(400).json({ message: "Bộ lọc yêu cầu có trường không hợp lệ" });
    }

    const status = trimText(req.query.trangThai).toUpperCase();
    if (status && !["CHO_DUYET", "DA_DUYET", "TU_CHOI", "DA_HUY"].includes(status)) {
        return res.status(400).json({ message: "Trạng thái yêu cầu không hợp lệ" });
    }
    if (trimText(req.query.keyword).length > 100) {
        return res.status(400).json({ message: "Từ khóa không được vượt quá 100 ký tự" });
    }

    req.requestFilters = {
        trangThai: status,
        keyword: trimText(req.query.keyword)
    };
    next();
}

function validateApproveBorrow(req, res, next) {
    if (hasUnexpectedFields(req.body, ["HanTra"]) || isEmpty(req.body.HanTra)) {
        return res.status(400).json({ message: "Vui lòng nhập hạn trả" });
    }

    const dueDate = String(req.body.HanTra).slice(0, 10);
    if (isNaN(Date.parse(dueDate)) || dueDate <= getCurrentDate()) {
        return res.status(400).json({ message: "Hạn trả phải sau ngày hiện tại" });
    }
    req.body.HanTra = dueDate;
    next();
}

function validateRejectRequest(req, res, next) {
    if (hasUnexpectedFields(req.body, ["LyDoTuChoi"])) {
        return res.status(400).json({ message: "Dữ liệu từ chối có trường không hợp lệ" });
    }
    const reason = trimText(req.body.LyDoTuChoi);
    if (!reason || reason.length > 255) {
        return res.status(400).json({ message: "Lý do từ chối phải có từ 1 đến 255 ký tự" });
    }
    req.body.LyDoTuChoi = reason;
    next();
}

function validateRequestId(req, res, next) {
    const requestId = Number(req.params.maYC);
    if (!Number.isInteger(requestId) || requestId < 1) {
        return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    req.params.maYC = requestId;
    next();
}

module.exports = {
    validateApproveBorrow,
    validateCreateRequest,
    validateRejectRequest,
    validateRequestId,
    validateRequestList
};
