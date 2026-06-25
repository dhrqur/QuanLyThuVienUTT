const express = require("express");
const router = express.Router();

const NgonNguController = require("../controllers/ngonngu.controller");
const {
    validateNgonNgu,
    validateSearchNgonNgu
} = require("../middlewares/ngonngu.middleware");

/**
 * @swagger
 * tags:
 *   name: NgonNgu
 *   description: API quan ly ngon ngu
 */

/**
 * @swagger
 * /api/ngonngu:
 *   get:
 *     summary: Lay danh sach ngon ngu
 *     tags: [NgonNgu]
 *     responses:
 *       200:
 *         description: Lay danh sach ngon ngu thanh cong
 */
router.get("/", NgonNguController.getAll);

/**
 * @swagger
 * /api/ngonngu/tim-kiem:
 *   get:
 *     summary: Tim kiem ngon ngu
 *     tags: [NgonNgu]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: NN010
 *     responses:
 *       200:
 *         description: Tim kiem ngon ngu thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchNgonNgu, NgonNguController.search);


/**
 * @swagger
 * /api/ngonngu/thong-ke:
 *   get:
 *     summary: Thong ke ngon ngu
 *     tags: [NgonNgu]
 *     responses:
 *       200:
 *         description: Thong ke ngon ngu thanh cong
 */
router.get("/thong-ke", NgonNguController.getStatistics);
/**
 * @swagger
 * /api/ngonngu/{maNN}:
 *   get:
 *     summary: Lay thong tin ngon ngu theo ma
 *     tags: [NgonNgu]
 *     parameters:
 *       - in: path
 *         name: maNN
 *         required: true
 *         schema:
 *           type: string
 *         example: NN010
 *     responses:
 *       200:
 *         description: Lay thong tin ngon ngu thanh cong
 *       404:
 *         description: Khong tim thay ngon ngu
 */
router.get("/:maNN", NgonNguController.getById);

/**
 * @swagger
 * /api/ngonngu:
 *   post:
 *     summary: Them ngon ngu moi
 *     tags: [NgonNgu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaNN:
 *                   type: string
 *                   example: "NN010"
 *                 TenNN:
 *                   type: string
 *                   example: "Tieng Y"
 *     responses:
 *       201:
 *         description: Them ngon ngu thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma ngon ngu da ton tai
 */
router.post("/", validateNgonNgu, NgonNguController.create);

/**
 * @swagger
 * /api/ngonngu/{maNN}:
 *   put:
 *     summary: Cap nhat thong tin ngon ngu
 *     tags: [NgonNgu]
 *     parameters:
 *       - in: path
 *         name: maNN
 *         required: true
 *         schema:
 *           type: string
 *         example: NN010
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaNN:
 *                   type: string
 *                   example: "NN010"
 *                 TenNN:
 *                   type: string
 *                   example: "Tieng Y"
 *     responses:
 *       200:
 *         description: Cap nhat ngon ngu thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay ngon ngu
 */
router.put("/:maNN", validateNgonNgu, NgonNguController.update);

/**
 * @swagger
 * /api/ngonngu/{maNN}:
 *   delete:
 *     summary: Xoa ngon ngu
 *     tags: [NgonNgu]
 *     parameters:
 *       - in: path
 *         name: maNN
 *         required: true
 *         schema:
 *           type: string
 *         example: NN010
 *     responses:
 *       200:
 *         description: Xoa ngon ngu thanh cong
 *       400:
 *         description: Khong the xoa ngon ngu
 *       404:
 *         description: Khong tim thay ngon ngu
 */
router.delete("/:maNN", NgonNguController.delete);

module.exports = router;
