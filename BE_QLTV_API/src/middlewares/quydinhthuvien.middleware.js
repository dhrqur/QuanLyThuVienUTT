function validate(req, res, next) {
    const fields = ["PhiQuaHanMoiNgay", "PhiHuHongMoiBan", "PhiLamMatMoiBan"];
    if (Object.keys(req.body).some((key) => !fields.includes(key))) return res.status(400).json({ message: "Du lieu quy dinh co truong khong hop le" });
    if (fields.some((key) => !Number.isFinite(Number(req.body[key])) || Number(req.body[key]) < 0)) return res.status(400).json({ message: "Muc phi phai la so khong am" });
    next();
}
module.exports = validate;
