const express = require("express");
const router = express.Router();

const KeSachController = require("../controllers/kesach.controller");
const {
    validateKeSach,
    validateSearchKeSach
} = require("../middlewares/kesach.middleware");

/**
 * @swagger
 * tags:
 *   name: KeSach
 *   description: API quan ly ke sach
 */

/**
 * @swagger
 * /api/kesach:
 *   get:
 *     summary: Lay danh sach ke sach
 *     tags: [KeSach]
 *     responses:
 *       200:
 *         description: Lay danh sach ke sach thanh cong
 */
router.get("/", KeSachController.getAll);

/**
 * @swagger
 * /api/kesach/tim-kiem:
 *   get:
 *     summary: Tim kiem ke sach
 *     tags: [KeSach]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: KS008
 *     responses:
 *       200:
 *         description: Tim kiem ke sach thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchKeSach, KeSachController.search);


/**
 * @swagger
 * /api/kesach/thong-ke:
 *   get:
 *     summary: Thong ke ke sach
 *     tags: [KeSach]
 *     responses:
 *       200:
 *         description: Thong ke ke sach thanh cong
 */
router.get("/thong-ke", KeSachController.getStatistics);
/**
 * @swagger
 * /api/kesach/{maViTri}:
 *   get:
 *     summary: Lay thong tin ke sach theo ma
 *     tags: [KeSach]
 *     parameters:
 *       - in: path
 *         name: maViTri
 *         required: true
 *         schema:
 *           type: string
 *         example: KS008
 *     responses:
 *       200:
 *         description: Lay thong tin ke sach thanh cong
 *       404:
 *         description: Khong tim thay ke sach
 */
router.get("/:maViTri", KeSachController.getById);

/**
 * @swagger
 * /api/kesach:
 *   post:
 *     summary: Them ke sach moi
 *     tags: [KeSach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaViTri:
 *                   type: string
 *                   example: "KS008"
 *                 TenKe:
 *                   type: string
 *                   example: "Ke tham khao"
 *                 MoTa:
 *                   type: string
 *                   example: "Sach tham khao"
 *     responses:
 *       201:
 *         description: Them ke sach thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma ke sach da ton tai
 */
router.post("/", validateKeSach, KeSachController.create);

/**
 * @swagger
 * /api/kesach/{maViTri}:
 *   put:
 *     summary: Cap nhat thong tin ke sach
 *     tags: [KeSach]
 *     parameters:
 *       - in: path
 *         name: maViTri
 *         required: true
 *         schema:
 *           type: string
 *         example: KS008
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaViTri:
 *                   type: string
 *                   example: "KS008"
 *                 TenKe:
 *                   type: string
 *                   example: "Ke tham khao"
 *                 MoTa:
 *                   type: string
 *                   example: "Sach tham khao"
 *     responses:
 *       200:
 *         description: Cap nhat ke sach thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay ke sach
 */
router.put("/:maViTri", validateKeSach, KeSachController.update);

/**
 * @swagger
 * /api/kesach/{maViTri}:
 *   delete:
 *     summary: Xoa ke sach
 *     tags: [KeSach]
 *     parameters:
 *       - in: path
 *         name: maViTri
 *         required: true
 *         schema:
 *           type: string
 *         example: KS008
 *     responses:
 *       200:
 *         description: Xoa ke sach thanh cong
 *       400:
 *         description: Khong the xoa ke sach
 *       404:
 *         description: Khong tim thay ke sach
 */
router.delete("/:maViTri", KeSachController.delete);

module.exports = router;
