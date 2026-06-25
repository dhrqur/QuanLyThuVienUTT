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

    setMaSach(MaSach) {
        this.MaSach = MaSach;
    }

    getMaTG() {
        return this.MaTG;
    }

    setMaTG(MaTG) {
        this.MaTG = MaTG;
    }

    getMaNXB() {
        return this.MaNXB;
    }

    setMaNXB(MaNXB) {
        this.MaNXB = MaNXB;
    }

    getMaTL() {
        return this.MaTL;
    }

    setMaTL(MaTL) {
        this.MaTL = MaTL;
    }

    getTenSach() {
        return this.TenSach;
    }

    setTenSach(TenSach) {
        this.TenSach = TenSach;
    }

    getNamXB() {
        return this.NamXB;
    }

    setNamXB(NamXB) {
        this.NamXB = NamXB;
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

    setMaNN(MaNN) {
        this.MaNN = MaNN;
    }

    getMaViTri() {
        return this.MaViTri;
    }

    setMaViTri(MaViTri) {
        this.MaViTri = MaViTri;
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