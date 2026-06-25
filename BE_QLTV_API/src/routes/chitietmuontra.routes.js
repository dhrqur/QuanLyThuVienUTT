const express = require("express");
const router = express.Router();

const ChiTietMuonTraController = require("../controllers/chitietmuontra.controller");
const {
    validateChiTietMuonTra,
    validateSearchChiTietMuonTra
} = require("../middlewares/chitietmuontra.middleware");

/**
 * @swagger
 * tags:
 *   name: ChiTietMuonTra
 *   description: API quan ly chi tiet muon tra
 */

/**
 * @swagger
 * /api/chitietmuontra:
 *   get:
 *     summary: Lay danh sach chi tiet muon tra
 *     tags: [ChiTietMuonTra]
 *     responses:
 *       200:
 *         description: Lay danh sach chi tiet muon tra thanh cong
 */
router.get("/", ChiTietMuonTraController.getAll);

/**
 * @swagger
 * /api/chitietmuontra/tim-kiem:
 *   get:
 *     summary: Tim kiem chi tiet muon tra
 *     tags: [ChiTietMuonTra]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *     responses:
 *       200:
 *         description: Tim kiem chi tiet muon tra thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchChiTietMuonTra, ChiTietMuonTraController.search);


/**
 * @swagger
 * /api/chitietmuontra/thong-ke:
 *   get:
 *     summary: Thong ke chi tiet muon tra
 *     tags: [ChiTietMuonTra]
 *     responses:
 *       200:
 *         description: Thong ke chi tiet muon tra thanh cong
 */
router.get("/thong-ke", ChiTietMuonTraController.getStatistics);
/**
 * @swagger
 * /api/chitietmuontra/{maMT}/{maSach}:
 *   get:
 *     summary: Lay thong tin chi tiet muon tra theo ma
 *     tags: [ChiTietMuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S001
 *     responses:
 *       200:
 *         description: Lay thong tin chi tiet muon tra thanh cong
 *       404:
 *         description: Khong tim thay chi tiet muon tra
 */
router.get("/:maMT/:maSach", ChiTietMuonTraController.getById);

/**
 * @swagger
 * /api/chitietmuontra:
 *   post:
 *     summary: Them chi tiet muon tra moi
 *     tags: [ChiTietMuonTra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaMT:
 *                   type: string
 *                   example: "MT04"
 *                 MaSach:
 *                   type: string
 *                   example: "S001"
 *                 SoLuong:
 *                   type: integer
 *                   example: 1
 *     responses:
 *       201:
 *         description: Them chi tiet muon tra thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma chi tiet muon tra da ton tai
 */
router.post("/", validateChiTietMuonTra, ChiTietMuonTraController.create);

/**
 * @swagger
 * /api/chitietmuontra/{maMT}/{maSach}:
 *   put:
 *     summary: Cap nhat thong tin chi tiet muon tra
 *     tags: [ChiTietMuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 MaMT:
 *                   type: string
 *                   example: "MT04"
 *                 MaSach:
 *                   type: string
 *                   example: "S001"
 *                 SoLuong:
 *                   type: integer
 *                   example: 1
 *     responses:
 *       200:
 *         description: Cap nhat chi tiet muon tra thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay chi tiet muon tra
 */
router.put("/:maMT/:maSach", validateChiTietMuonTra, ChiTietMuonTraController.update);

/**
 * @swagger
 * /api/chitietmuontra/{maMT}/{maSach}:
 *   delete:
 *     summary: Xoa chi tiet muon tra
 *     tags: [ChiTietMuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *       - in: path
 *         name: maSach
 *         required: true
 *         schema:
 *           type: string
 *         example: S001
 *     responses:
 *       200:
 *         description: Xoa chi tiet muon tra thanh cong
 *       400:
 *         description: Khong the xoa chi tiet muon tra
 *       404:
 *         description: Khong tim thay chi tiet muon tra
 */
router.delete("/:maMT/:maSach", ChiTietMuonTraController.delete);

module.exports = router;
