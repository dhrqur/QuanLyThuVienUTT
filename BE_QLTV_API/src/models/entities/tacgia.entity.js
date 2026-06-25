class TacGia {

    constructor(data) {
        this.MaTG = data.MaTG;
        this.TenTG = data.TenTG;
        this.NamSinh = data.NamSinh || null;
        this.GioiTinh = data.GioiTinh;
        this.QuocTich = data.QuocTich;
    }

    getMaTG() {
        return this.MaTG;
    }

    getTenTG() {
        return this.TenTG;
    }

    getNamSinh() {
        return this.NamSinh;
    }

    getGioiTinh() {
        return this.GioiTinh;
    }

    getQuocTich() {
        return this.QuocTich;
    }

    toObject() {
        return {
            MaTG: this.MaTG,
            TenTG: this.TenTG,
            NamSinh: this.NamSinh,
            GioiTinh: this.GioiTinh,
            QuocTich: this.QuocTich
        };
    }
}

module.exports = TacGia;
