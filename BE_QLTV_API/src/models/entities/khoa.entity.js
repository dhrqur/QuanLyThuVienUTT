class Khoa {

    constructor(data) {
        this.MaKhoa = data.MaKhoa;
        this.TenKhoa = data.TenKhoa;
    }

    getMaKhoa() {
        return this.MaKhoa;
    }

    getTenKhoa() {
        return this.TenKhoa;
    }

    toObject() {
        return {
            MaKhoa: this.MaKhoa,
            TenKhoa: this.TenKhoa
        };
    }
}

module.exports = Khoa;
