const express = require("express");

const controller = require("../controllers/yeucaumuontra.controller");
const {
    validateApproveBorrow,
    validateRejectRequest,
    validateRequestId,
    validateRequestList
} = require("../middlewares/yeucaumuontra.middleware");

const router = express.Router();

router.get("/", validateRequestList, controller.listAll.bind(controller));
router.put(
    "/:maYC/duyet-muon",
    validateRequestId,
    validateApproveBorrow,
    controller.approveBorrow.bind(controller)
);
router.put(
    "/:maYC/tu-choi",
    validateRequestId,
    validateRejectRequest,
    controller.reject.bind(controller)
);

module.exports = router;
