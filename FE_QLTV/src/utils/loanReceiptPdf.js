import { formatCurrency } from "@/utils/numberUtils";
import { formatDisplayDate } from "@/utils/dateUtils";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const formatDate = (value) => formatDisplayDate(String(value ?? "").slice(0, 10)) || "Chưa cập nhật";

export function printLoanReceipt({ books, details, row }) {
  const bookRows = details.map((detail) => {
    const book = books.find((item) => item.MaSach === detail.MaSach);
    return `<tr><td>${escapeHtml(detail.MaSach)}</td><td>${escapeHtml(book?.TenSach ?? detail.TenSach ?? "Chưa xác định")}</td><td class="center">${escapeHtml(detail.SoLuong)}</td></tr>`;
  }).join("") || '<tr><td colspan="3" class="center">Chưa có sách trong phiếu.</td></tr>';

  const documentHtml = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu mượn trả ${escapeHtml(row.MaMT)}</title><style>
    @page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#111827;font-size:13px}header{text-align:center;border-bottom:2px solid #ea580c;padding-bottom:12px;margin-bottom:18px}h1{font-size:22px;margin:0;color:#c2410c}h2{font-size:14px;margin:6px 0 0;color:#475569}.info{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:14px 0 18px}.info p{margin:0;border-bottom:1px solid #e2e8f0;padding:6px 0}.label{font-weight:700;color:#475569}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:9px;text-align:left}th{background:#fff7ed;color:#9a3412}.center{text-align:center}.total{margin-top:16px;text-align:right;font-size:15px;font-weight:700}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:48px;text-align:center;margin-top:52px}.signatures p{margin:4px}.muted{color:#64748b;font-size:12px}
  </style></head><body><header><h1>PHIẾU MƯỢN - TRẢ SÁCH</h1><h2>Thư viện UTT</h2></header><section class="info">
    <p><span class="label">Mã phiếu:</span> ${escapeHtml(row.MaMT)}</p><p><span class="label">Trạng thái:</span> ${escapeHtml(row.TrangThai)}</p>
    <p><span class="label">Độc giả:</span> ${escapeHtml(row.TenDG ?? row.MaDG)}</p><p><span class="label">Mã độc giả:</span> ${escapeHtml(row.MaDG)}</p>
    <p><span class="label">Nhân viên:</span> ${escapeHtml(row.TenNV ?? row.MaNV)}</p><p><span class="label">Ngày mượn:</span> ${escapeHtml(formatDate(row.NgayMuon))}</p>
    <p><span class="label">Hạn trả:</span> ${escapeHtml(formatDate(row.HanTra))}</p><p><span class="label">Ngày trả:</span> ${escapeHtml(formatDate(row.NgayTra))}</p>
  </section><h3>Danh sách sách mượn</h3><table><thead><tr><th>Mã sách</th><th>Tên sách</th><th class="center">Số lượng</th></tr></thead><tbody>${bookRows}</tbody></table>
  <p class="total">Tiền phạt: ${escapeHtml(formatCurrency(row.TienPhat ?? 0))}</p><p class="muted">Ngày in: ${escapeHtml(new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date()))}</p>
  <section class="signatures"><div><p><b>Độc giả</b></p><p class="muted">(Ký và ghi rõ họ tên)</p></div><div><p><b>Thủ thư</b></p><p class="muted">(Ký và ghi rõ họ tên)</p></div></section></body></html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
  return true;
}
