const ThongKeService = require("../services/thongke.service");

class ThongKeController {
    constructor() {
        this.getTongQuan = this.getTongQuan.bind(this);
    }

    async getTongQuan(req, res) {
        try {
            const data = await ThongKeService.getTongQuan();

            res.status(200).json({
                message: "Thong ke tong quan thanh cong",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                message: error.message || "Loi he thong"
            });
        }
    }
}

module.exports = new ThongKeController();
