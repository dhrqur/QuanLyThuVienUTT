export function getLoanAlert(loan) {
  if (loan.NgayTra) return { level: "done", text: "Đã trả" };
  const overdueDays = Number(loan.SoNgayQuaHan || 0);
  if (overdueDays > 0) return { level: "danger", text: `Quá hạn ${overdueDays} ngày` };
  const remainingDays = Number(loan.SoNgayConLai);
  if (remainingDays >= 0 && remainingDays <= 3) {
    return { level: "warning", text: remainingDays === 0 ? "Hạn trả hôm nay" : `Còn ${remainingDays} ngày` };
  }
  return { level: "normal", text: "Đang mượn" };
}
