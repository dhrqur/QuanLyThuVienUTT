const express = require("express");
const router = express.Router();

const MuonTraController = require("../controllers/muontra.controller");
const {
    validateMuonTra,
    validateSearchMuonTra,
    validateTraSach
} = require("../middlewares/muontra.middleware");

/**
 * @swagger
 * tags:
 *   name: MuonTra
 *   description: API quan ly phieu muon
 */

/**
 * @swagger
 * /api/muontra:
 *   get:
 *     summary: Lay danh sach muon tra
 *     tags: [MuonTra]
 *     responses:
 *       200:
 *         description: Lay danh sach muon tra thanh cong
 */
router.get("/", MuonTraController.getAll);

/**
 * @swagger
 * /api/muontra/tim-kiem:
 *   get:
 *     summary: Tim kiem muon tra
 *     tags: [MuonTra]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *     responses:
 *       200:
 *         description: Tim kiem muon tra thanh cong
 *       400:
 *         description: Tu khoa tim kiem khong hop le
 */
router.get("/tim-kiem", validateSearchMuonTra, MuonTraController.search);

/**
 * @swagger
 * /api/muontra/thong-ke:
 *   get:
 *     summary: Thong ke phieu muon
 *     tags: [MuonTra]
 *     responses:
 *       200:
 *         description: Thong ke phieu muon thanh cong
 */
router.get("/thong-ke", MuonTraController.getStatistics);

/**
 * @swagger
 * /api/muontra/{maMT}/tra-sach:
 *   put:
 *     summary: Ghi nhan tra sach
 *     tags: [MuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [NgayTra]
 *             properties:
 *               NgayTra:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Tra sach thanh cong
 */
router.put("/:maMT/tra-sach", validateTraSach, MuonTraController.returnBooks);

/**
 * @swagger
 * /api/muontra/{maMT}:
 *   get:
 *     summary: Lay thong tin muon tra theo ma
 *     tags: [MuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *     responses:
 *       200:
 *         description: Lay thong tin muon tra thanh cong
 *       404:
 *         description: Khong tim thay muon tra
 */
router.get("/:maMT", MuonTraController.getById);

/**
 * @swagger
 * /api/muontra:
 *   post:
 *     summary: Them muon tra moi
 *     tags: [MuonTra]
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
 *                 MaDG:
 *                   type: string
 *                   example: "DG001"
 *                 MaNV:
 *                   type: string
 *                   example: "NV001"
 *                 NgayMuon:
 *                   type: string
 *                   example: "2026-01-01"
 *                 HanTra:
 *                   type: string
 *                   example: "2026-01-15"
 *                 TrangThai:
 *                   type: string
 *                   example: "Chua tra"
 *                 ChiTiet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaSach:
 *                         type: string
 *                         example: "S001"
 *                       SoLuong:
 *                         type: integer
 *                         example: 1
 *     responses:
 *       201:
 *         description: Them muon tra thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       409:
 *         description: Ma muon tra da ton tai
 */
router.post("/", validateMuonTra, MuonTraController.create);

/**
 * @swagger
 * /api/muontra/{maMT}:
 *   put:
 *     summary: Cap nhat thong tin muon tra
 *     tags: [MuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
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
 *                 MaDG:
 *                   type: string
 *                   example: "DG001"
 *                 MaNV:
 *                   type: string
 *                   example: "NV001"
 *                 NgayMuon:
 *                   type: string
 *                   example: "2026-01-01"
 *                 HanTra:
 *                   type: string
 *                   example: "2026-01-15"
 *                 TrangThai:
 *                   type: string
 *                   example: "Chua tra"
 *                 ChiTiet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaSach:
 *                         type: string
 *                         example: "S001"
 *                       SoLuong:
 *                         type: integer
 *                         example: 1
 *     responses:
 *       200:
 *         description: Cap nhat muon tra thanh cong
 *       400:
 *         description: Du lieu khong hop le
 *       404:
 *         description: Khong tim thay muon tra
 */
router.put("/:maMT", validateMuonTra, MuonTraController.update);

/**
 * @swagger
 * /api/muontra/{maMT}:
 *   delete:
 *     summary: Xoa muon tra
 *     tags: [MuonTra]
 *     parameters:
 *       - in: path
 *         name: maMT
 *         required: true
 *         schema:
 *           type: string
 *         example: MT04
 *     responses:
 *       200:
 *         description: Xoa muon tra thanh cong
 *       400:
 *         description: Khong the xoa muon tra
 *       404:
 *         description: Khong tim thay muon tra
 */
router.delete("/:maMT", MuonTraController.delete);

module.exports = router;
