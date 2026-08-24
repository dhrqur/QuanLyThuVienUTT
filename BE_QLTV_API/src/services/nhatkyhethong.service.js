const repository = require("../models/repositories/nhatkyhethong.repository");

class NhatKyHeThongService {
    async getAll() {
        return await repository.getAll();
    }

    async search(keyword) {
        return await repository.search(keyword);
    }

    async create(entry) {
        return await repository.create(entry);
    }
}

module.exports = new NhatKyHeThongService();
