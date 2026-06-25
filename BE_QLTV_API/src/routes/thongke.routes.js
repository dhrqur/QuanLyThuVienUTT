const express = require("express");
const router = express.Router();

const ThongKeController = require("../controllers/thongke.controller");

/**
 * @swagger
 * tags:
 *   name: ThongKe
 *   description: API thong ke tong quan he thong
 */

/**
 * @swagger
 * /api/thongke/tong-quan:
 *   get:
 *     summary: Thong ke tong quan tat ca tinh nang
 *     tags: [ThongKe]
 *     responses:
 *       200:
 *         description: Thong ke tong quan thanh cong
 */
router.get("/tong-quan", ThongKeController.getTongQuan);

module.exports = router;
