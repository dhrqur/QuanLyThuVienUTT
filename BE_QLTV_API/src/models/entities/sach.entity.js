class Sach {

    constructor(data) {
        this.MaSach = data.MaSach;
        this.MaTG = data.MaTG;
        this.MaNXB = data.MaNXB;
        this.MaTL = data.MaTL;
        this.TenSach = data.TenSach;
        this.NamXB = data.NamXB;
        this.SoLuong = data.SoLuong;
        this.MaNN = data.MaNN;
        this.MaViTri = data.MaViTri;
    }

    getMaSach() {
        return this.MaSach;
    }

    getMaTG() {
        return this.MaTG;
    }

    getMaNXB() {
        return this.MaNXB;
    }

    getMaTL() {
        return this.MaTL;
    }

    getTenSach() {
        return this.TenSach;
    }

    getNamXB() {
        return this.NamXB;
    }

    getSoLuong() {
        return this.SoLuong;
    }

    setSoLuong(SoLuong) {
        if (SoLuong < 0) {
            throw new Error("Số lượng không được nhỏ hơn 0");
        }

        this.SoLuong = SoLuong;
    }

    getMaNN() {
        return this.MaNN;
    }

    getMaViTri() {
        return this.MaViTri;
    }

    toObject() {
        return {
            MaSach: this.MaSach,
            MaTG: this.MaTG,
            MaNXB: this.MaNXB,
            MaTL: this.MaTL,
            TenSach: this.TenSach,
            NamXB: this.NamXB,
            SoLuong: this.SoLuong,
            MaNN: this.MaNN,
            MaViTri: this.MaViTri
        };
    }
}

module.exports = Sach;
