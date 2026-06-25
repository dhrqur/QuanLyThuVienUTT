class NhanVien {

    constructor(data) {
        this.MaNV = data.MaNV;
        this.TenNV = data.TenNV;
        this.QueQuan = data.QueQuan;
        this.GioiTinh = data.GioiTinh;
        this.NamSinh = data.NamSinh;
        this.VaiTro = data.VaiTro;
        this.Email = data.Email;
        this.Sdt = data.Sdt;
        this.User = data.User;
        this.Pass = data.Pass;
    }

    getMaNV() {
        return this.MaNV;
    }

    getTenNV() {
        return this.TenNV;
    }

    getQueQuan() {
        return this.QueQuan;
    }

    getGioiTinh() {
        return this.GioiTinh;
    }

    getNamSinh() {
        return this.NamSinh;
    }

    getVaiTro() {
        return this.VaiTro;
    }

    getEmail() {
        return this.Email;
    }

    getSdt() {
        return this.Sdt;
    }

    getUser() {
        return this.User;
    }

    getPass() {
        return this.Pass;
    }

    toObject() {
        return {
            MaNV: this.MaNV,
            TenNV: this.TenNV,
            QueQuan: this.QueQuan,
            GioiTinh: this.GioiTinh,
            NamSinh: this.NamSinh,
            VaiTro: this.VaiTro,
            Email: this.Email,
            Sdt: this.Sdt,
            User: this.User,
            Pass: this.Pass
        };
    }

    toSafeObject() {
        return {
            MaNV: this.MaNV,
            TenNV: this.TenNV,
            QueQuan: this.QueQuan,
            GioiTinh: this.GioiTinh,
            NamSinh: this.NamSinh,
            VaiTro: this.VaiTro,
            Email: this.Email,
            Sdt: this.Sdt,
            User: this.User
        };
    }
}

module.exports = NhanVien;
