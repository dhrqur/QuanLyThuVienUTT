class NgonNgu {

    constructor(data) {
        this.MaNN = data.MaNN;
        this.TenNN = data.TenNN;
    }

    getMaNN() {
        return this.MaNN;
    }

    getTenNN() {
        return this.TenNN;
    }

    toObject() {
        return {
            MaNN: this.MaNN,
            TenNN: this.TenNN
        };
    }
}

module.exports = NgonNgu;
