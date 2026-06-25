const express = require("express");
const router = express.Router();

const NhanVienController = require("../controllers/nhanvien.controller");
const {
    validateNhanVien,
    validateLogin,
    validateSearch
} = require("../middlewares/nhanvien.middleware");

/**
 * @swagger
 * tags:
 *   name: NhanVien
 *   description: API quan ly nhan vien
 */

/**
 * @swagger
 * /api/nhanvien/dang-nhap:
 *   post:
 *     summary: Dang nhap nhan vien
 *     tags: [NhanVien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NhanVienLogin'
 *     responses:
 *       200:
 *         description: Dang nhap thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dang nhap thanh cong
 *                 data:
 *                   $ref: '#/components/schemas/NhanVien'
 *       400:
 *         description: Du lieu dang nhap khong hop le
 *       401:
 *         description: Ten dang nhap hoac mat khau khong dung
 */
router.post("/dang-nhap", validateLogin, NhanVienController.login);

/**
 * @swagger
 * /api/nhanvien/dang-xuat:
 *   post:
 *     summary: Dang xuat nhan vien
 *     tags: [NhanVien]
 *     responses:
 *       200:
 *         description: Dang xuat thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dang xuat thanh cong
 */
router.post("/dang-xuat", NhanVienController.logout);

/**
 * @swagger
 * /api/nhanvien:
 *   get:
 *     summary: Lay danh sach nhan vien
 *     tags: [NhanVien]
 *     responses:
 *       200:
 *         description: Lay danh sach nhan vien thanh cong
 */
router.get("/", NhanVienController.getAll);

/**
 * @swagger
 * /api/nhanvien/tim-kiem:
 *   get:
 *     summary: Tim kiem nhan vien
 *     tags: [NhanVien]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: NV001
 *     responses:
 *       200:
 *         description: Tim kiem nhan vien thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearch, NhanVienController.search);

/**
 * @swagger
 * /api/nhanvien/thong-ke:
 *   get:
 *     summary: Thong ke nhan vien
 *     tags: [NhanVien]
 *     responses:
 *       200:
 *         description: Thong ke nhan vien thanh cong
 */
router.get("/thong-ke", NhanVienController.getStatistics);
/**
 * @swagger
 * /api/nhanvien/{maNV}:
 *   get:
 *     summary: Lay thong tin nhan vien theo ma
 *     tags: [NhanVien]
 *     parameters:
 *       - in: path
 *         name: maNV
 *         required: true
 *         schema:
 *           type: string
 *         example: NV001
 *     responses:
 *       200:
 *         description: Lay thong tin nhan vien thanh cong
 *       404:
 *         description: Khong tim thay nhan vien
 */
router.get("/:maNV", NhanVienController.getById);

/**
 * @swagger
 * /api/nhanvien:
 *   post:
 *     summary: Them nhan vien moi
 *     tags: [NhanVien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NhanVienInput'
 *     responses:
 *       201:
 *         description: Them nhan vien thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma nhan vien hoac ten dang nhap da ton tai
 */
router.post("/", validateNhanVien, NhanVienController.create);

/**
 * @swagger
 * /api/nhanvien/{maNV}:
 *   put:
 *     summary: Cap nhat thong tin nhan vien
 *     tags: [NhanVien]
 *     parameters:
 *       - in: path
 *         name: maNV
 *         required: true
 *         schema:
 *           type: string
 *         example: NV001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NhanVienInput'
 *     responses:
 *       200:
 *         description: Cap nhat nhan vien thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay nhan vien
 *       409:
 *         description: Ten dang nhap da ton tai
 */
router.put("/:maNV", validateNhanVien, NhanVienController.update);

/**
 * @swagger
 * /api/nhanvien/{maNV}:
 *   delete:
 *     summary: Xoa nhan vien
 *     tags: [NhanVien]
 *     parameters:
 *       - in: path
 *         name: maNV
 *         required: true
 *         schema:
 *           type: string
 *         example: NV001
 *     responses:
 *       200:
 *         description: Xoa nhan vien thanh cong
 *       400:
 *         description: Khong the xoa nhan vien
 *       404:
 *         description: Khong tim thay nhan vien
 */
router.delete("/:maNV", NhanVienController.delete);

module.exports = router;
