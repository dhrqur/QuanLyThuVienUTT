const express = require("express");
const router = express.Router();

const TheThuVienController = require("../controllers/thethuvien.controller");
const {
    validateTheThuVien,
    validateSearchTheThuVien
} = require("../middlewares/thethuvien.middleware");

/**
 * @swagger
 * tags:
 *   name: TheThuVien
 *   description: API quan ly the thu vien
 */

/**
 * @swagger
 * /api/thethuvien:
 *   get:
 *     summary: Lay danh sach the thu vien
 *     tags: [TheThuVien]
 *     responses:
 *       200:
 *         description: Lay danh sach the thu vien thanh cong
 */
router.get("/", TheThuVienController.getAll);

/**
 * @swagger
 * /api/thethuvien/tim-kiem:
 *   get:
 *     summary: Tim kiem the thu vien
 *     tags: [TheThuVien]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: TTV004
 *     responses:
 *       200:
 *         description: Tim kiem the thu vien thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchTheThuVien, TheThuVienController.search);


/**
 * @swagger
 * /api/thethuvien/thong-ke:
 *   get:
 *     summary: Thong ke the thu vien
 *     tags: [TheThuVien]
 *     responses:
 *       200:
 *         description: Thong ke the thu vien thanh cong
 */
router.get("/thong-ke", TheThuVienController.getStatistics);
/**
 * @swagger
 * /api/thethuvien/{maThe}:
 *   get:
 *     summary: Lay thong tin the thu vien theo ma
 *     tags: [TheThuVien]
 *     parameters:
 *       - in: path
 *         name: maThe
 *         required: true
 *         schema:
 *           type: string
 *         example: TTV004
 *     responses:
 *       200:
 *         description: Lay thong tin the thu vien thanh cong
 *       404:
 *         description: Khong tim thay the thu vien
 */
router.get("/:maThe", TheThuVienController.getById);

/**
 * @swagger
 * /api/thethuvien:
 *   post:
 *     summary: Them the thu vien moi
 *     tags: [TheThuVien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaThe:
 *                   type: string
 *                   example: "TTV004"
 *                 MaDG:
 *                   type: string
 *                   example: "DG001"
 *                 NgayCap:
 *                   type: string
 *                   example: "2026-01-01"
 *                 NgayHetHan:
 *                   type: string
 *                   example: "2027-01-01"
 *                 TrangThai:
 *                   type: string
 *                   example: "Con hieu luc"
 *     responses:
 *       201:
 *         description: Them the thu vien thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma the thu vien da ton tai
 */
router.post("/", validateTheThuVien, TheThuVienController.create);

/**
 * @swagger
 * /api/thethuvien/{maThe}:
 *   put:
 *     summary: Cap nhat thong tin the thu vien
 *     tags: [TheThuVien]
 *     parameters:
 *       - in: path
 *         name: maThe
 *         required: true
 *         schema:
 *           type: string
 *         example: TTV004
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaThe:
 *                   type: string
 *                   example: "TTV004"
 *                 MaDG:
 *                   type: string
 *                   example: "DG001"
 *                 NgayCap:
 *                   type: string
 *                   example: "2026-01-01"
 *                 NgayHetHan:
 *                   type: string
 *                   example: "2027-01-01"
 *                 TrangThai:
 *                   type: string
 *                   example: "Con hieu luc"
 *     responses:
 *       200:
 *         description: Cap nhat the thu vien thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay the thu vien
 */
router.put("/:maThe", validateTheThuVien, TheThuVienController.update);

/**
 * @swagger
 * /api/thethuvien/{maThe}:
 *   delete:
 *     summary: Xoa the thu vien
 *     tags: [TheThuVien]
 *     parameters:
 *       - in: path
 *         name: maThe
 *         required: true
 *         schema:
 *           type: string
 *         example: TTV004
 *     responses:
 *       200:
 *         description: Xoa the thu vien thanh cong
 *       400:
 *         description: Khong the xoa the thu vien
 *       404:
 *         description: Khong tim thay the thu vien
 */
router.delete("/:maThe", TheThuVienController.delete);

module.exports = router;
