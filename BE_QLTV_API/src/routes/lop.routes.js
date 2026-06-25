const express = require("express");
const router = express.Router();

const LopController = require("../controllers/lop.controller");
const {
    validateLop,
    validateSearchLop
} = require("../middlewares/lop.middleware");

/**
 * @swagger
 * tags:
 *   name: Lop
 *   description: API quan ly lop
 */

/**
 * @swagger
 * /api/lop:
 *   get:
 *     summary: Lay danh sach lop
 *     tags: [Lop]
 *     responses:
 *       200:
 *         description: Lay danh sach lop thanh cong
 */
router.get("/", LopController.getAll);

/**
 * @swagger
 * /api/lop/tim-kiem:
 *   get:
 *     summary: Tim kiem lop
 *     tags: [Lop]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: L038
 *     responses:
 *       200:
 *         description: Tim kiem lop thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchLop, LopController.search);


/**
 * @swagger
 * /api/lop/thong-ke:
 *   get:
 *     summary: Thong ke lop
 *     tags: [Lop]
 *     responses:
 *       200:
 *         description: Thong ke lop thanh cong
 */
router.get("/thong-ke", LopController.getStatistics);
/**
 * @swagger
 * /api/lop/{maLop}:
 *   get:
 *     summary: Lay thong tin lop theo ma
 *     tags: [Lop]
 *     parameters:
 *       - in: path
 *         name: maLop
 *         required: true
 *         schema:
 *           type: string
 *         example: L038
 *     responses:
 *       200:
 *         description: Lay thong tin lop thanh cong
 *       404:
 *         description: Khong tim thay lop
 */
router.get("/:maLop", LopController.getById);

/**
 * @swagger
 * /api/lop:
 *   post:
 *     summary: Them lop moi
 *     tags: [Lop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaLop:
 *                   type: string
 *                   example: "L038"
 *                 TenLop:
 *                   type: string
 *                   example: "75DCHT21"
 *                 MaKhoa:
 *                   type: string
 *                   example: "KH001"
 *     responses:
 *       201:
 *         description: Them lop thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma lop da ton tai
 */
router.post("/", validateLop, LopController.create);

/**
 * @swagger
 * /api/lop/{maLop}:
 *   put:
 *     summary: Cap nhat thong tin lop
 *     tags: [Lop]
 *     parameters:
 *       - in: path
 *         name: maLop
 *         required: true
 *         schema:
 *           type: string
 *         example: L038
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaLop:
 *                   type: string
 *                   example: "L038"
 *                 TenLop:
 *                   type: string
 *                   example: "75DCHT21"
 *                 MaKhoa:
 *                   type: string
 *                   example: "KH001"
 *     responses:
 *       200:
 *         description: Cap nhat lop thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay lop
 */
router.put("/:maLop", validateLop, LopController.update);

/**
 * @swagger
 * /api/lop/{maLop}:
 *   delete:
 *     summary: Xoa lop
 *     tags: [Lop]
 *     parameters:
 *       - in: path
 *         name: maLop
 *         required: true
 *         schema:
 *           type: string
 *         example: L038
 *     responses:
 *       200:
 *         description: Xoa lop thanh cong
 *       400:
 *         description: Khong the xoa lop
 *       404:
 *         description: Khong tim thay lop
 */
router.delete("/:maLop", LopController.delete);

module.exports = router;
