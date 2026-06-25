class Lop {

    constructor(data) {
        this.MaLop = data.MaLop;
        this.TenLop = data.TenLop;
        this.MaKhoa = data.MaKhoa === undefined || data.MaKhoa === "" ? null : data.MaKhoa;
    }

    getMaLop() {
        return this.MaLop;
    }

    getTenLop() {
        return this.TenLop;
    }

    getMaKhoa() {
        return this.MaKhoa;
    }

    toObject() {
        return {
            MaLop: this.MaLop,
            TenLop: this.TenLop,
            MaKhoa: this.MaKhoa
        };
    }
}

module.exports = Lop;
