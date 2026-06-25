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

    if (!MaSach || !MaTG || !MaNXB || !MaTL || !TenSach || !NamXB || !MaNN || !MaViTri || SoLuong === undefined || SoLuong === null|| SoLuong === "") {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin sách"
        });
    }

    if (SoLuong < 0) {
        return res.status(400).json({
            message: "Số lượng không được nhỏ hơn 0"
        });
    } 
    if(isNaN(SoLuong)){
        return res.status(400).json({
            message: "Số lượng phải là một số"
        });
    }
    if(SoLuong % 1 !== 0){
        return res.status(400).json({
            message: "Số lượng phải là một số nguyên"
        });
    }
    if (NamXB < 0) {
        return res.status(400).json({
            message: "Năm xuất bản không hợp lệ"
        });
    }
    if(isNaN(NamXB)){
        return res.status(400).json({
            message: "Năm xuất bản phải là một số"
        });
    }

    next();
}

function validateSearchSach(req, res, next) {
    const { keyword } = req.query;

    if (keyword === undefined || keyword === null || String(keyword).trim() === "") {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem sach"
        });
    }

    next();
}

module.exports = {
    validateSach,
    validateSearchSach
};
