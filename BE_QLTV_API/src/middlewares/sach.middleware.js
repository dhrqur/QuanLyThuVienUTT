const { isEmpty } = require("../utils/validation");

function validateSach(req, res, next) {
    const {
        MaSach,
        MaTG,
        MaNXB,
        MaTL,
        TenSach,
        NamXB,
        SoLuong,
        MaNN,
        MaViTri
    } = req.body;

    const requiredValues = [MaSach, MaTG, MaNXB, MaTL, TenSach, NamXB, SoLuong, MaNN, MaViTri];

    if (requiredValues.some(isEmpty)) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin sách"
        });
    }

    const normalizedQuantity = Number(SoLuong);
    const normalizedYear = Number(NamXB);

    if (!Number.isFinite(normalizedQuantity)) {
        return res.status(400).json({
            message: "Số lượng phải là một số"
        });
    }

    if (normalizedQuantity < 0) {
        return res.status(400).json({
            message: "Số lượng không được nhỏ hơn 0"
        });
    }

    if (!Number.isInteger(normalizedQuantity)) {
        return res.status(400).json({
            message: "Số lượng phải là một số nguyên"
        });
    }

    if (!Number.isFinite(normalizedYear)) {
        return res.status(400).json({
            message: "Năm xuất bản phải là một số"
        });
    }

    if (normalizedYear < 0) {
        return res.status(400).json({
            message: "Năm xuất bản không hợp lệ"
        });
    }

    next();
}

function validateSearchSach(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui lòng nhập từ khóa tìm kiếm sách"
        });
    }

    next();
}

module.exports = {
    validateSach,
    validateSearchSach
};
