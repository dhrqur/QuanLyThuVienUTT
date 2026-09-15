const express = require("express");

const controller = require("../controllers/yeucaumuontra.controller");
const { validateTraSach } = require("../middlewares/muontra.middleware");
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
    controller.approveBorrow.bind(controller)
);
router.put(
    "/:maYC/da-lay",
    validateRequestId,
    validateApproveBorrow,
    controller.confirmPickup.bind(controller)
);
router.put(
    "/:maYC/duyet-tra",
    validateRequestId,
    validateTraSach,
    controller.approveReturn.bind(controller)
);
router.put(
    "/:maYC/tu-choi",
    validateRequestId,
    validateRejectRequest,
    controller.reject.bind(controller)
);

module.exports = router;

