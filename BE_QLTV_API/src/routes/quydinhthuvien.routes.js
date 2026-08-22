const express = require("express");
const controller = require("../controllers/quydinhthuvien.controller");
const validate = require("../middlewares/quydinhthuvien.middleware");
const { requireManager } = require("../middlewares/auth.middleware");
const router = express.Router();
router.get("/", controller.get.bind(controller));
router.put("/", requireManager, validate, controller.update.bind(controller));
module.exports = router;
