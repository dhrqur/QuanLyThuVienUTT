const express = require("express");
const router = express.Router();

const DocGiaController = require("../controllers/docgia.controller");
const {
    validateDocGia,
    validateSearchDocGia
} = require("../middlewares/docgia.middleware");

/**
 * @swagger
 * tags:
 *   name: DocGia
 *   description: API quan ly doc gia
 */

/**
 * @swagger
 * /api/docgia:
 *   get:
 *     summary: Lay danh sach doc gia
 *     tags: [DocGia]
 *     responses:
 *       200:
 *         description: Lay danh sach doc gia thanh cong
 */
router.get("/", DocGiaController.getAll);

/**
 * @swagger
 * /api/docgia/tim-kiem:
 *   get:
 *     summary: Tim kiem doc gia
 *     tags: [DocGia]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: DG001
 *     responses:
 *       200:
 *         description: Tim kiem doc gia thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchDocGia, DocGiaController.search);


/**
 * @swagger
 * /api/docgia/thong-ke:
 *   get:
 *     summary: Thong ke doc gia
 *     tags: [DocGia]
 *     responses:
 *       200:
 *         description: Thong ke doc gia thanh cong
 */
router.get("/thong-ke", DocGiaController.getStatistics);
/**
 * @swagger
 * /api/docgia/{maDG}:
 *   get:
 *     summary: Lay thong tin doc gia theo ma
 *     tags: [DocGia]
 *     parameters:
 *       - in: path
 *         name: maDG
 *         required: true
 *         schema:
 *           type: string
 *         example: DG001
 *     responses:
 *       200:
 *         description: Lay thong tin doc gia thanh cong
 *       404:
 *         description: Khong tim thay doc gia
 */
router.get("/:maDG", DocGiaController.getById);

/**
 * @swagger
 * /api/docgia:
 *   post:
 *     summary: Them doc gia moi
 *     tags: [DocGia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocGiaInput'
 *     responses:
 *       201:
 *         description: Them doc gia thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma doc gia da ton tai
 */
router.post("/", validateDocGia, DocGiaController.create);

/**
 * @swagger
 * /api/docgia/{maDG}:
 *   put:
 *     summary: Cap nhat thong tin doc gia
 *     tags: [DocGia]
 *     parameters:
 *       - in: path
 *         name: maDG
 *         required: true
 *         schema:
 *           type: string
 *         example: DG001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocGiaInput'
 *     responses:
 *       200:
 *         description: Cap nhat doc gia thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay doc gia
 */
router.put("/:maDG", validateDocGia, DocGiaController.update);

/**
 * @swagger
 * /api/docgia/{maDG}:
 *   delete:
 *     summary: Xoa doc gia
 *     tags: [DocGia]
 *     parameters:
 *       - in: path
 *         name: maDG
 *         required: true
 *         schema:
 *           type: string
 *         example: DG001
 *     responses:
 *       200:
 *         description: Xoa doc gia thanh cong
 *       400:
 *         description: Khong the xoa doc gia
 *       404:
 *         description: Khong tim thay doc gia
 */
router.delete("/:maDG", DocGiaController.delete);

module.exports = router;
