class ChiTietMuonTra {

    constructor(data) {
        this.MaMT = data.MaMT;
        this.MaSach = data.MaSach;
        this.SoLuong = data.SoLuong;
    }

    getMaMT() {
        return this.MaMT;
    }

    getMaSach() {
        return this.MaSach;
    }

    getSoLuong() {
        return this.SoLuong;
    }

    toObject() {
        return {
            MaMT: this.MaMT,
            MaSach: this.MaSach,
            SoLuong: this.SoLuong
        };
    }
}

module.exports = ChiTietMuonTra;
