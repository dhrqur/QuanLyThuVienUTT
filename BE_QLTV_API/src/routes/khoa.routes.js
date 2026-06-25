const express = require("express");
const router = express.Router();

const KhoaController = require("../controllers/khoa.controller");
const {
    validateKhoa,
    validateSearchKhoa
} = require("../middlewares/khoa.middleware");

/**
 * @swagger
 * tags:
 *   name: Khoa
 *   description: API quan ly khoa
 */

/**
 * @swagger
 * /api/khoa:
 *   get:
 *     summary: Lay danh sach khoa
 *     tags: [Khoa]
 *     responses:
 *       200:
 *         description: Lay danh sach khoa thanh cong
 */
router.get("/", KhoaController.getAll);

/**
 * @swagger
 * /api/khoa/tim-kiem:
 *   get:
 *     summary: Tim kiem khoa
 *     tags: [Khoa]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: KH013
 *     responses:
 *       200:
 *         description: Tim kiem khoa thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchKhoa, KhoaController.search);


/**
 * @swagger
 * /api/khoa/thong-ke:
 *   get:
 *     summary: Thong ke khoa
 *     tags: [Khoa]
 *     responses:
 *       200:
 *         description: Thong ke khoa thanh cong
 */
router.get("/thong-ke", KhoaController.getStatistics);
/**
 * @swagger
 * /api/khoa/{maKhoa}:
 *   get:
 *     summary: Lay thong tin khoa theo ma
 *     tags: [Khoa]
 *     parameters:
 *       - in: path
 *         name: maKhoa
 *         required: true
 *         schema:
 *           type: string
 *         example: KH013
 *     responses:
 *       200:
 *         description: Lay thong tin khoa thanh cong
 *       404:
 *         description: Khong tim thay khoa
 */
router.get("/:maKhoa", KhoaController.getById);

/**
 * @swagger
 * /api/khoa:
 *   post:
 *     summary: Them khoa moi
 *     tags: [Khoa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaKhoa:
 *                   type: string
 *                   example: "KH013"
 *                 TenKhoa:
 *                   type: string
 *                   example: "Cong nghe moi"
 *     responses:
 *       201:
 *         description: Them khoa thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma khoa da ton tai
 */
router.post("/", validateKhoa, KhoaController.create);

/**
 * @swagger
 * /api/khoa/{maKhoa}:
 *   put:
 *     summary: Cap nhat thong tin khoa
 *     tags: [Khoa]
 *     parameters:
 *       - in: path
 *         name: maKhoa
 *         required: true
 *         schema:
 *           type: string
 *         example: KH013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaKhoa:
 *                   type: string
 *                   example: "KH013"
 *                 TenKhoa:
 *                   type: string
 *                   example: "Cong nghe moi"
 *     responses:
 *       200:
 *         description: Cap nhat khoa thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay khoa
 */
router.put("/:maKhoa", validateKhoa, KhoaController.update);

/**
 * @swagger
 * /api/khoa/{maKhoa}:
 *   delete:
 *     summary: Xoa khoa
 *     tags: [Khoa]
 *     parameters:
 *       - in: path
 *         name: maKhoa
 *         required: true
 *         schema:
 *           type: string
 *         example: KH013
 *     responses:
 *       200:
 *         description: Xoa khoa thanh cong
 *       400:
 *         description: Khong the xoa khoa
 *       404:
 *         description: Khong tim thay khoa
 */
router.delete("/:maKhoa", KhoaController.delete);

module.exports = router;
