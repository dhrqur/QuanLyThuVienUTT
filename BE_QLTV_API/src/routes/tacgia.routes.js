const express = require("express");
const router = express.Router();

const TacGiaController = require("../controllers/tacgia.controller");
const {
    validateTacGia,
    validateSearchTacGia
} = require("../middlewares/tacgia.middleware");

/**
 * @swagger
 * tags:
 *   name: TacGia
 *   description: API quan ly tac gia
 */

/**
 * @swagger
 * /api/tacgia:
 *   get:
 *     summary: Lay danh sach tac gia
 *     tags: [TacGia]
 *     responses:
 *       200:
 *         description: Lay danh sach tac gia thanh cong
 */
router.get("/", TacGiaController.getAll);

/**
 * @swagger
 * /api/tacgia/tim-kiem:
 *   get:
 *     summary: Tim kiem tac gia
 *     tags: [TacGia]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: TG001
 *     responses:
 *       200:
 *         description: Tim kiem tac gia thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchTacGia, TacGiaController.search);


/**
 * @swagger
 * /api/tacgia/thong-ke:
 *   get:
 *     summary: Thong ke tac gia
 *     tags: [TacGia]
 *     responses:
 *       200:
 *         description: Thong ke tac gia thanh cong
 */
router.get("/thong-ke", TacGiaController.getStatistics);
/**
 * @swagger
 * /api/tacgia/{maTG}:
 *   get:
 *     summary: Lay thong tin tac gia theo ma
 *     tags: [TacGia]
 *     parameters:
 *       - in: path
 *         name: maTG
 *         required: true
 *         schema:
 *           type: string
 *         example: TG001
 *     responses:
 *       200:
 *         description: Lay thong tin tac gia thanh cong
 *       404:
 *         description: Khong tim thay tac gia
 */
router.get("/:maTG", TacGiaController.getById);

/**
 * @swagger
 * /api/tacgia:
 *   post:
 *     summary: Them tac gia moi
 *     tags: [TacGia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TacGiaInput'
 *     responses:
 *       201:
 *         description: Them tac gia thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma tac gia da ton tai
 */
router.post("/", validateTacGia, TacGiaController.create);

/**
 * @swagger
 * /api/tacgia/{maTG}:
 *   put:
 *     summary: Cap nhat thong tin tac gia
 *     tags: [TacGia]
 *     parameters:
 *       - in: path
 *         name: maTG
 *         required: true
 *         schema:
 *           type: string
 *         example: TG001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TacGiaInput'
 *     responses:
 *       200:
 *         description: Cap nhat tac gia thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay tac gia
 */
router.put("/:maTG", validateTacGia, TacGiaController.update);

/**
 * @swagger
 * /api/tacgia/{maTG}:
 *   delete:
 *     summary: Xoa tac gia
 *     tags: [TacGia]
 *     parameters:
 *       - in: path
 *         name: maTG
 *         required: true
 *         schema:
 *           type: string
 *         example: TG001
 *     responses:
 *       200:
 *         description: Xoa tac gia thanh cong
 *       400:
 *         description: Khong the xoa tac gia
 *       404:
 *         description: Khong tim thay tac gia
 */
router.delete("/:maTG", TacGiaController.delete);

module.exports = router;
