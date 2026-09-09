const bcrypt = require("bcrypt");

const { createReaderAccessToken } = require("../middlewares/auth.middleware");
const DocGiaRepository = require("../models/repositories/docgia.repository");
const { createHttpError: createError } = require("../utils/http");
const { trimText } = require("../utils/validation");

const BCRYPT_ROUNDS = 12;
const DEFAULT_READER_PASSWORD = "123456";
const DUMMY_PASSWORD_HASH = "$2b$12$c8X6s8oK/Sf3gZivONAY3u3izOCykdfr2sVaQobK2YwYQIuY9wx2i";

function hashReaderPassword(password) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
}

class DocGiaAuthService {
    constructor(repository = DocGiaRepository) {
        this.repository = repository;
    }

    async login(data) {
        const maDG = trimText(data.MaDG);
        const password = String(data.Pass);
        const reader = await this.repository.getByIdWithPassword(maDG);
        const passwordMatches = await bcrypt.compare(
            password,
            String(reader?.Pass || DUMMY_PASSWORD_HASH)
        );

        if (!reader || !passwordMatches) {
            throw createError("Mã độc giả hoặc mật khẩu không đúng", 401);
        }

        const mustChangePassword = await bcrypt.compare(
            DEFAULT_READER_PASSWORD,
            String(reader.Pass)
        );
        const { Pass, ...safeReader } = reader;

        return {
            token: createReaderAccessToken({
                MaDG: safeReader.MaDG,
                mustChangePassword
            }),
            user: safeReader,
            mustChangePassword
        };
    }

    async changePassword(maDG, data) {
        const reader = await this.repository.getByIdWithPassword(maDG);

        if (!reader) {
            throw createError("Không tìm thấy độc giả", 404);
        }

        if (!(await bcrypt.compare(String(data.MatKhauCu), String(reader.Pass)))) {
            throw createError("Mật khẩu hiện tại không đúng", 400);
        }

        if (String(data.MatKhauMoi) === DEFAULT_READER_PASSWORD) {
            throw createError("Mật khẩu mới không được trùng mật khẩu tạm thời", 400);
        }

        if (await bcrypt.compare(String(data.MatKhauMoi), String(reader.Pass))) {
            throw createError("Mật khẩu mới phải khác mật khẩu hiện tại", 400);
        }

        const updated = await this.repository.updatePassword(
            maDG,
            await hashReaderPassword(String(data.MatKhauMoi))
        );

        if (!updated) {
            throw createError("Không thể đổi mật khẩu", 400);
        }

        const { Pass, ...safeReader } = reader;
        return {
            token: createReaderAccessToken({
                MaDG: safeReader.MaDG,
                mustChangePassword: false
            }),
            user: safeReader,
            mustChangePassword: false
        };
    }
}

module.exports = new DocGiaAuthService();
module.exports.BCRYPT_ROUNDS = BCRYPT_ROUNDS;
module.exports.DEFAULT_READER_PASSWORD = DEFAULT_READER_PASSWORD;
module.exports.DocGiaAuthService = DocGiaAuthService;
module.exports.hashReaderPassword = hashReaderPassword;
