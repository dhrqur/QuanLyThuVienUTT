const express = require("express");
const router = express.Router();

const ThongKeController = require("../controllers/thongke.controller");

router.get("/dashboard", ThongKeController.getDashboard);

module.exports = router;
