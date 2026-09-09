const express = require("express");

const controller = require("../controllers/docgia-auth.controller");
const {
    authenticate,
    requireReader
} = require("../middlewares/auth.middleware");
const {
    validatePasswordChange,
    validateReaderLogin
} = require("../middlewares/docgia-auth.middleware");
const { limitReaderLogin } = require("../middlewares/login-rate-limit.middleware");

const router = express.Router();

router.post(
    "/dang-nhap",
    limitReaderLogin,
    validateReaderLogin,
    controller.login.bind(controller)
);
router.put(
    "/doi-mat-khau",
    authenticate,
    requireReader,
    validatePasswordChange,
    controller.changePassword.bind(controller)
);

module.exports = router;
