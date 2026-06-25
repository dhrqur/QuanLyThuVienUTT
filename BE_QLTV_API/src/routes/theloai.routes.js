const express = require("express");
const router = express.Router();

const TheLoaiController = require("../controllers/theloai.controller");
const {
    validateTheLoai,
    validateSearchTheLoai
} = require("../middlewares/theloai.middleware");

/**
 * @swagger
 * tags:
 *   name: TheLoai
 *   description: API quan ly the loai
 */

/**
 * @swagger
 * /api/theloai:
 *   get:
 *     summary: Lay danh sach the loai
 *     tags: [TheLoai]
 *     responses:
 *       200:
 *         description: Lay danh sach the loai thanh cong
 */
router.get("/", TheLoaiController.getAll);

/**
 * @swagger
 * /api/theloai/tim-kiem:
 *   get:
 *     summary: Tim kiem the loai
 *     tags: [TheLoai]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: TL001
 *     responses:
 *       200:
 *         description: Tim kiem the loai thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchTheLoai, TheLoaiController.search);


/**
 * @swagger
 * /api/theloai/thong-ke:
 *   get:
 *     summary: Thong ke the loai
 *     tags: [TheLoai]
 *     responses:
 *       200:
 *         description: Thong ke the loai thanh cong
 */
router.get("/thong-ke", TheLoaiController.getStatistics);
/**
 * @swagger
 * /api/theloai/{maTL}:
 *   get:
 *     summary: Lay thong tin the loai theo ma
 *     tags: [TheLoai]
 *     parameters:
 *       - in: path
 *         name: maTL
 *         required: true
 *         schema:
 *           type: string
 *         example: TL001
 *     responses:
 *       200:
 *         description: Lay thong tin the loai thanh cong
 *       404:
 *         description: Khong tim thay the loai
 */
router.get("/:maTL", TheLoaiController.getById);

/**
 * @swagger
 * /api/theloai:
 *   post:
 *     summary: Them the loai moi
 *     tags: [TheLoai]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TheLoaiInput'
 *     responses:
 *       201:
 *         description: Them the loai thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma the loai da ton tai
 */
router.post("/", validateTheLoai, TheLoaiController.create);

/**
 * @swagger
 * /api/theloai/{maTL}:
 *   put:
 *     summary: Cap nhat thong tin the loai
 *     tags: [TheLoai]
 *     parameters:
 *       - in: path
 *         name: maTL
 *         required: true
 *         schema:
 *           type: string
 *         example: TL001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TheLoaiInput'
 *     responses:
 *       200:
 *         description: Cap nhat the loai thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay the loai
 */
router.put("/:maTL", validateTheLoai, TheLoaiController.update);

/**
 * @swagger
 * /api/theloai/{maTL}:
 *   delete:
 *     summary: Xoa the loai
 *     tags: [TheLoai]
 *     parameters:
 *       - in: path
 *         name: maTL
 *         required: true
 *         schema:
 *           type: string
 *         example: TL001
 *     responses:
 *       200:
 *         description: Xoa the loai thanh cong
 *       400:
 *         description: Khong the xoa the loai
 *       404:
 *         description: Khong tim thay the loai
 */
router.delete("/:maTL", TheLoaiController.delete);

module.exports = router;
