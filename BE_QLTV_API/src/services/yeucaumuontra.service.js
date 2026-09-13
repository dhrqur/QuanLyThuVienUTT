const YeuCauMuonTraRepository = require("../models/repositories/yeucaumuontra.repository");
const { getCurrentDate } = require("../utils/date");
const { createHttpError: createError } = require("../utils/http");
const { trimText } = require("../utils/validation");

function toRequestError(error) {
    if (error.statusCode) return error;
    const message = String(error.message || "Không thể xử lý yêu cầu");
    const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (normalized.includes("khong tim thay") || normalized.includes("khong ton tai")) {
        return createError(message, 404);
    }
    if (normalized.includes("da co") || normalized.includes("da duoc") || normalized.includes("da xu ly")) {
        return createError(message, 409);
    }
    return createError(message, 400);
}

class YeuCauMuonTraService {
    constructor(repository = YeuCauMuonTraRepository) {
        this.repository = repository;
    }

    getOwn(readerId, filters = {}) {
        return this.repository.getAll(filters, readerId);
    }

    getAll(filters = {}) {
        return this.repository.getAll(filters);
    }

    async create(readerId, data) {
        try {
            return await this.repository.create(readerId, data);
        } catch (error) {
            throw toRequestError(error);
        }
    }

    async cancel(requestId, readerId) {
        try {
            return await this.repository.cancel(requestId, readerId);
        } catch (error) {
            throw toRequestError(error);
        }
    }

    async approveBorrow(requestId, dueDate, employeeId) {
        try {
            return await this.repository.approveBorrow(
                requestId,
                dueDate,
                employeeId,
                getCurrentDate()
            );
        } catch (error) {
            throw toRequestError(error);
        }
    }

    async reject(requestId, reason, employeeId) {
        try {
            return await this.repository.reject(requestId, trimText(reason), employeeId);
        } catch (error) {
            throw toRequestError(error);
        }
    }
}

module.exports = new YeuCauMuonTraService();
module.exports.YeuCauMuonTraService = YeuCauMuonTraService;
