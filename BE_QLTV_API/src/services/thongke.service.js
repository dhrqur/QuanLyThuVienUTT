const ThongKeRepository = require("../models/repositories/thongke.repository");

class ThongKeService {
    async getTongQuan() {
        return await ThongKeRepository.getTongQuan();
    }
}

module.exports = new ThongKeService();
