const express = require("express");
const router = express.Router();

const NhaXuatBanController = require("../controllers/nhaxuatban.controller");
const {
    validateNhaXuatBan,
    validateSearchNhaXuatBan
} = require("../middlewares/nhaxuatban.middleware");

/**
 * @swagger
 * tags:
 *   name: NhaXuatBan
 *   description: API quan ly nha xuat ban
 */

/**
 * @swagger
 * /api/nhaxuatban:
 *   get:
 *     summary: Lay danh sach nha xuat ban
 *     tags: [NhaXuatBan]
 *     responses:
 *       200:
 *         description: Lay danh sach nha xuat ban thanh cong
 */
router.get("/", NhaXuatBanController.getAll);

/**
 * @swagger
 * /api/nhaxuatban/tim-kiem:
 *   get:
 *     summary: Tim kiem nha xuat ban
 *     tags: [NhaXuatBan]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: NXB001
 *     responses:
 *       200:
 *         description: Tim kiem nha xuat ban thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchNhaXuatBan, NhaXuatBanController.search);


/**
 * @swagger
 * /api/nhaxuatban/thong-ke:
 *   get:
 *     summary: Thong ke nha xuat ban
 *     tags: [NhaXuatBan]
 *     responses:
 *       200:
 *         description: Thong ke nha xuat ban thanh cong
 */
router.get("/thong-ke", NhaXuatBanController.getStatistics);
/**
 * @swagger
 * /api/nhaxuatban/{maNXB}:
 *   get:
 *     summary: Lay thong tin nha xuat ban theo ma
 *     tags: [NhaXuatBan]
 *     parameters:
 *       - in: path
 *         name: maNXB
 *         required: true
 *         schema:
 *           type: string
 *         example: NXB001
 *     responses:
 *       200:
 *         description: Lay thong tin nha xuat ban thanh cong
 *       404:
 *         description: Khong tim thay nha xuat ban
 */
router.get("/:maNXB", NhaXuatBanController.getById);

/**
 * @swagger
 * /api/nhaxuatban:
 *   post:
 *     summary: Them nha xuat ban moi
 *     tags: [NhaXuatBan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NhaXuatBanInput'
 *     responses:
 *       201:
 *         description: Them nha xuat ban thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma nha xuat ban da ton tai
 */
router.post("/", validateNhaXuatBan, NhaXuatBanController.create);

/**
 * @swagger
 * /api/nhaxuatban/{maNXB}:
 *   put:
 *     summary: Cap nhat thong tin nha xuat ban
 *     tags: [NhaXuatBan]
 *     parameters:
 *       - in: path
 *         name: maNXB
 *         required: true
 *         schema:
 *           type: string
 *         example: NXB001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NhaXuatBanInput'
 *     responses:
 *       200:
 *         description: Cap nhat nha xuat ban thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay nha xuat ban
 */
router.put("/:maNXB", validateNhaXuatBan, NhaXuatBanController.update);

/**
 * @swagger
 * /api/nhaxuatban/{maNXB}:
 *   delete:
 *     summary: Xoa nha xuat ban
 *     tags: [NhaXuatBan]
 *     parameters:
 *       - in: path
 *         name: maNXB
 *         required: true
 *         schema:
 *           type: string
 *         example: NXB001
 *     responses:
 *       200:
 *         description: Xoa nha xuat ban thanh cong
 *       400:
 *         description: Khong the xoa nha xuat ban
 *       404:
 *         description: Khong tim thay nha xuat ban
 */
router.delete("/:maNXB", NhaXuatBanController.delete);

module.exports = router;
