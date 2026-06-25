class TheThuVien {

    constructor(data) {
        this.MaThe = data.MaThe;
        this.MaDG = data.MaDG;
        this.NgayCap = data.NgayCap;
        this.NgayHetHan = data.NgayHetHan;
        this.TrangThai = data.TrangThai;
    }

    getMaThe() {
        return this.MaThe;
    }

    getMaDG() {
        return this.MaDG;
    }

    getNgayCap() {
        return this.NgayCap;
    }

    getNgayHetHan() {
        return this.NgayHetHan;
    }

    getTrangThai() {
        return this.TrangThai;
    }

    toObject() {
        return {
            MaThe: this.MaThe,
            MaDG: this.MaDG,
            NgayCap: this.NgayCap,
            NgayHetHan: this.NgayHetHan,
            TrangThai: this.TrangThai
        };
    }
}

module.exports = TheThuVien;
