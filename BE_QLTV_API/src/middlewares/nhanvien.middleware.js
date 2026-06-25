const allowedNhanVienFields = [
    "MaNV",
    "TenNV",
    "QueQuan",
    "GioiTinh",
    "NamSinh",
    "VaiTro",
    "Email",
    "Sdt",
    "User",
    "Pass"
];

function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

function hasUnexpectedFields(data, allowedFields) {
    return Object.keys(data).some((field) => !allowedFields.includes(field));
}

function validateNhanVien(req, res, next) {
    if (hasUnexpectedFields(req.body, allowedNhanVienFields)) {
        return res.status(400).json({
            message: "Du lieu nhan vien co truong khong hop le"
        });
    }

    const {
        MaNV,
        TenNV,
        QueQuan,
        GioiTinh,
        NamSinh,
        VaiTro,
        Email,
        Sdt,
        User,
        Pass
    } = req.body;
    const isUpdate = req.method === "PUT";

    if (
        isEmpty(MaNV) ||
        isEmpty(TenNV) ||
        isEmpty(QueQuan) ||
        isEmpty(GioiTinh) ||
        isEmpty(NamSinh) ||
        isEmpty(VaiTro) ||
        isEmpty(Email) ||
        isEmpty(Sdt) ||
        isEmpty(User) ||
        (!isUpdate && isEmpty(Pass))
    ) {
        return res.status(400).json({
            message: "Vui long nhap day du thong tin nhan vien"
        });
    }

    if (String(MaNV).trim().length > 10) {
        return res.status(400).json({
            message: "Ma nhan vien khong duoc vuot qua 10 ky tu"
        });
    }

    if (String(TenNV).trim().length > 50) {
        return res.status(400).json({
            message: "Ten nhan vien khong duoc vuot qua 50 ky tu"
        });
    }

    if (String(QueQuan).trim().length > 50) {
        return res.status(400).json({
            message: "Que quan khong duoc vuot qua 50 ky tu"
        });
    }

    if (String(GioiTinh).trim().length > 10) {
        return res.status(400).json({
            message: "Gioi tinh khong duoc vuot qua 10 ky tu"
        });
    }

    if (isNaN(NamSinh) || String(NamSinh).trim().length > 10) {
        return res.status(400).json({
            message: "Nam sinh khong hop le"
        });
    }

    if (String(VaiTro).trim().length > 100) {
        return res.status(400).json({
            message: "Vai tro khong duoc vuot qua 100 ky tu"
        });
    }

    if (String(Email).trim().length > 50 || !String(Email).includes("@")) {
        return res.status(400).json({
            message: "Email khong hop le"
        });
    }

    if (String(Sdt).trim().length > 13 || isNaN(Sdt)) {
        return res.status(400).json({
            message: "So dien thoai khong hop le"
        });
    }

    if (String(User).trim().length > 50) {
        return res.status(400).json({
            message: "Ten dang nhap khong duoc vuot qua 50 ky tu"
        });
    }

    if (!isEmpty(Pass) && String(Pass).trim().length > 50) {
        return res.status(400).json({
            message: "Mat khau khong duoc vuot qua 50 ky tu"
        });
    }

    next();
}

function validateLogin(req, res, next) {
    const { User, Pass } = req.body;

    if (hasUnexpectedFields(req.body, ["User", "Pass"])) {
        return res.status(400).json({
            success: false,
            message: "Du lieu dang nhap co truong khong hop le"
        });
    }

    if (isEmpty(User) || isEmpty(Pass)) {
        return res.status(400).json({
            success: false,
            message: "Vui long nhap ten dang nhap va mat khau"
        });
    }

    next();
}

function validateSearch(req, res, next) {
    const { keyword } = req.query;

    if (isEmpty(keyword)) {
        return res.status(400).json({
            message: "Vui long nhap tu khoa tim kiem"
        });
    }

    next();
}

module.exports = {
    validateNhanVien,
    validateLogin,
    validateSearch
};
