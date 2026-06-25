class DocGia {

    constructor(data) {
        this.MaDG = data.MaDG;
        this.MaKhoa = data.MaKhoa;
        this.MaLop = data.MaLop;
        this.TenDG = data.TenDG;
        this.NamSinh = data.NamSinh || null;
        this.GioiTinh = data.GioiTinh;
        this.DiaChi = data.DiaChi;
        this.Email = data.Email;
        this.Sdt = data.Sdt;
    }

    getMaDG() {
        return this.MaDG;
    }

    getMaKhoa() {
        return this.MaKhoa;
    }

    getMaLop() {
        return this.MaLop;
    }

    getTenDG() {
        return this.TenDG;
    }

    getNamSinh() {
        return this.NamSinh;
    }

    getGioiTinh() {
        return this.GioiTinh;
    }

    getDiaChi() {
        return this.DiaChi;
    }

    getEmail() {
        return this.Email;
    }

    getSdt() {
        return this.Sdt;
    }

    toObject() {
        return {
            MaDG: this.MaDG,
            MaKhoa: this.MaKhoa,
            MaLop: this.MaLop,
            TenDG: this.TenDG,
            NamSinh: this.NamSinh,
            GioiTinh: this.GioiTinh,
            DiaChi: this.DiaChi,
            Email: this.Email,
            Sdt: this.Sdt
        };
    }
}

module.exports = DocGia;
