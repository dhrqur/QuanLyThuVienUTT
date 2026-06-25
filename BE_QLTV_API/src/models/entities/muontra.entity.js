class MuonTra {

    constructor(data) {
        this.MaMT = data.MaMT;
        this.MaDG = data.MaDG;
        this.MaNV = data.MaNV;
        this.NgayMuon = data.NgayMuon === undefined || data.NgayMuon === "" ? null : data.NgayMuon;
        this.HanTra = data.HanTra;
        this.NgayTra = data.NgayTra === undefined || data.NgayTra === "" ? null : data.NgayTra;
        this.TrangThai = data.TrangThai === undefined || data.TrangThai === "" ? null : data.TrangThai;
    }

    getMaMT() {
        return this.MaMT;
    }

    getMaDG() {
        return this.MaDG;
    }

    getMaNV() {
        return this.MaNV;
    }

    getNgayMuon() {
        return this.NgayMuon;
    }

    getHanTra() {
        return this.HanTra;
    }

    getNgayTra() {
        return this.NgayTra;
    }

    getTrangThai() {
        return this.TrangThai;
    }

    toObject() {
        return {
            MaMT: this.MaMT,
            MaDG: this.MaDG,
            MaNV: this.MaNV,
            NgayMuon: this.NgayMuon,
            HanTra: this.HanTra,
            NgayTra: this.NgayTra,
            TrangThai: this.TrangThai
        };
    }
}

module.exports = MuonTra;
