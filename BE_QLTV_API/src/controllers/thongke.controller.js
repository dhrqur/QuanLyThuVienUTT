const ThongKeService = require("../services/thongke.service");
const { handleControllerError } = require("../utils/http");

class ThongKeController {
    constructor() {
        this.getDashboard = this.getDashboard.bind(this);
    }

    async getDashboard(req, res) {
        try {
            const data = await ThongKeService.getDashboard(req.query);
            res.status(200).json({
                message: "Lay du lieu dashboard thanh cong",
                data
            });
        } catch (error) { handleControllerError(res, error); }
    }
}

module.exports = new ThongKeController();
