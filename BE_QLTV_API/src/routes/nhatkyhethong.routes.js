const express = require("express");
const controller = require("../controllers/nhatkyhethong.controller");

const router = express.Router();

router.get("/", controller.getAll.bind(controller));
router.get("/tim-kiem", (req, res, next) => {
    if (!req.query.keyword?.trim()) {
        return res.status(400).json({ message: "Vui long nhap tu khoa tim kiem" });
    }
    next();
}, controller.search.bind(controller));

module.exports = router;
