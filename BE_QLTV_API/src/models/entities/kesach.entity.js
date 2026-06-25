class KeSach {

    constructor(data) {
        this.MaViTri = data.MaViTri;
        this.TenKe = data.TenKe;
        this.MoTa = data.MoTa;
    }

    getMaViTri() {
        return this.MaViTri;
    }

    getTenKe() {
        return this.TenKe;
    }

    getMoTa() {
        return this.MoTa;
    }

    toObject() {
        return {
            MaViTri: this.MaViTri,
            TenKe: this.TenKe,
            MoTa: this.MoTa
        };
    }
}

module.exports = KeSach;
