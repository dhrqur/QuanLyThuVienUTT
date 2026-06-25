class NhaXuatBan {

    constructor(data) {
        this.MaNXB = data.MaNXB;
        this.TenNXB = data.TenNXB;
        this.DiaChi = data.DiaChi;
        this.Email = data.Email;
        this.Sdt = data.Sdt || null;
    }

    getMaNXB() {
        return this.MaNXB;
    }

    getTenNXB() {
        return this.TenNXB;
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
            MaNXB: this.MaNXB,
            TenNXB: this.TenNXB,
            DiaChi: this.DiaChi,
            Email: this.Email,
            Sdt: this.Sdt
        };
    }
}

module.exports = NhaXuatBan;
