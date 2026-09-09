const express = require("express");

const controller = require("../controllers/docgia-portal.controller");
const requestController = require("../controllers/yeucaumuontra.controller");
const {
    validateCatalogQuery,
    validateProfileUpdate
} = require("../middlewares/docgia-portal.middleware");
const {
    validateCreateRequest,
    validateRequestId,
    validateRequestList
} = require("../middlewares/yeucaumuontra.middleware");

const router = express.Router();

router.get("/tong-quan", controller.getDashboard.bind(controller));
router.get("/tai-khoan", controller.getProfile.bind(controller));
router.patch(
    "/tai-khoan",
    validateProfileUpdate,
    controller.updateProfile.bind(controller)
);
router.get("/the-thu-vien", controller.getLibraryCard.bind(controller));
router.get("/sach", validateCatalogQuery, controller.getCatalog.bind(controller));
router.get("/muon-tra", controller.getLoans.bind(controller));
router.get("/vi-pham", controller.getViolations.bind(controller));
router.get(
    "/yeu-cau",
    validateRequestList,
    requestController.listOwn.bind(requestController)
);
router.post(
    "/yeu-cau",
    validateCreateRequest,
    requestController.create.bind(requestController)
);
router.delete(
    "/yeu-cau/:maYC",
    validateRequestId,
    requestController.cancel.bind(requestController)
);

module.exports = router;
