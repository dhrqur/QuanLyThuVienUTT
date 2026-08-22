const ThongKeRepository = require("../models/repositories/thongke.repository");

class ThongKeService {
    async getDashboard(params) {
        return await ThongKeRepository.getDashboard(params);
    }
}

module.exports = new ThongKeService();
