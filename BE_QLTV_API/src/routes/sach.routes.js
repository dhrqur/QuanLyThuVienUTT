const express = require("express");
const router = express.Router();

const SachController = require("../controllers/sach.controller");
const { validateSach, validateSearchSach } = require("../middlewares/sach.middleware");

/**
 * @swagger
 * tags:
 *   name: Sach
 *   description: API quản lý sách
 */

/**
 * @swagger
 * /api/sach:
 *   get:
 *     summary: Lấy danh sách sách
 *     tags: [Sach]
 *     responses:
 *       200:
 *         description: Lấy danh sách sách thành công
 */
router.get("/", SachController.getAll);

/**
 * @swagger
 * /api/sach/tim-kiem:
 *   get:
 *     summary: Tim kiem sach
 *     tags: [Sach]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: Java
 *     responses:
 *       200:
 *         description: Tim kiem sach thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchSach, SachController.search);

/**
 * @swagger
 * /api/sach/thong-ke:
 *   get:
 *     summary: Thong ke sach
 *     tags: [Sach]
 *     responses:
 *       200:
 *         description: Thong ke sach thanh cong
 */
router.get("/thong-ke", SachController.getStatistics);

/**
 * @swagger
 * /api/sach/{maSach}:
 *   get:
 *     summary: Lấy thông tin sách theo mã sách
 *     tags: [Sach]
 *     parameters:
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S001
 *     responses:
 *       200:
 *         description: Lấy thông tin sách thành công
 *       404:
 *         description: Không tìm thấy sách
 */
router.get("/:maSach", SachController.getById);

/**
 * @swagger
 * /api/sach:
 *   post:
 *     summary: Thêm sách mới
 *     tags: [Sach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sach'
 *     responses:
 *       201:
 *         description: Thêm sách thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", validateSach, SachController.create);

/**
 * @swagger
 * /api/sach/{maSach}:
 *   put:
 *     summary: Cập nhật thông tin sách
 *     tags: [Sach]
 *     parameters:
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S015
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sach'
 *     responses:
 *       200:
 *         description: Cập nhật sách thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy sách
 */
router.put("/:maSach", validateSach, SachController.update);

/**
 * @swagger
 * /api/sach/{maSach}:
 *   delete:
 *     summary: Xóa sách
 *     tags: [Sach]
 *     parameters:
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S015
 *     responses:
 *       200:
 *         description: Xóa sách thành công
 *       400:
 *         description: Không thể xóa sách
 *       404:
 *         description: Không tìm thấy sách
 */
router.delete("/:maSach", SachController.delete);

module.exports = router;
