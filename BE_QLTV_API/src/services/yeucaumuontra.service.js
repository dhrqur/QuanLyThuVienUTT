const MuonTraService = require("./muontra.service");
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
    constructor(repository = YeuCauMuonTraRepository, loanService = MuonTraService) {
        this.repository = repository;
        this.loanService = loanService;
    }

    async getOwn(readerId, filters = {}) {
        return await this.repository.getAll(filters, readerId);
    }

    async getAll(filters = {}) {
        return await this.repository.getAll(filters);
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

    async approveBorrow(requestId, employeeId) {
        try {
            return await this.repository.approveBorrow(requestId, employeeId);
        } catch (error) {
            throw toRequestError(error);
        }
    }

    async confirmPickup(requestId, dueDate, employeeId) {
        try {
            return await this.repository.confirmPickup(
                requestId,
                dueDate,
                employeeId,
                getCurrentDate()
            );
        } catch (error) {
            throw toRequestError(error);
        }
    }

    async approveReturn(requestId, data, employeeId) {
        try {
            return await this.repository.processReturn(
                requestId,
                employeeId,
                async (request, connection) => await this.loanService.returnBooks(
                    request.MaMT,
                    data.NgayTra,
                    data.ChiTietTra || [],
                    employeeId,
                    connection
                )
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
