export const OVERDUE_FINE_PER_DAY = 2000;

export function getMuonTraStatus(row) {
  if (row?.NgayTra) {
    return "Đã trả";
  }

  if (row?.HanTra && row.HanTra < getTodayValue()) {
    return "Quá hạn";
  }

  return "Đang mượn";
}

export function getTodayValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function getOverdueDays(dueDate, returnDate) {
  if (!dueDate || !returnDate) return 0;
  const difference = new Date(`${returnDate}T00:00:00`) - new Date(`${dueDate}T00:00:00`);
  return Math.max(0, Math.ceil(difference / 86_400_000));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
