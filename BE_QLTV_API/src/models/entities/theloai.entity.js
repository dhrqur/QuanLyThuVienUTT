class TheLoai {

    constructor(data) {
        this.MaTL = data.MaTL;
        this.TenTL = data.TenTL;
    }

    getMaTL() {
        return this.MaTL;
    }

    getTenTL() {
        return this.TenTL;
    }

    toObject() {
        return {
            MaTL: this.MaTL,
            TenTL: this.TenTL
        };
    }
}

module.exports = TheLoai;
