const express = require("express");
const controller = require("../controllers/xulyvipham.controller");
const { validateSearch, validateUpdate } = require("../middlewares/xulyvipham.middleware");
const router = express.Router();
router.get("/", controller.getAll.bind(controller));
router.get("/tim-kiem", validateSearch, controller.search.bind(controller));
router.put("/:maVP", validateUpdate, controller.update.bind(controller));
module.exports = router;
