function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} đ`;
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : "—";
}

function table(title, headers, rows) {
  const body = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")
    : `<tr><td class="empty" colspan="${headers.length}">Chưa có dữ liệu.</td></tr>`;
  return `<section><h2>${esc(title)}</h2><table><thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></section>`;
}

function reportHtml({ overview, overdueTickets, timeline, title, topBooks, topReaders }) {
  const generatedAt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date());
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    @page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#172033;font-size:12px}header{border-bottom:3px solid #ea580c;padding-bottom:12px}h1{margin:0;color:#c2410c;font-size:23px}h2{margin:25px 0 9px;color:#9a3412;font-size:15px}.muted{color:#64748b}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:16px}.stat{border:1px solid #fed7aa;border-radius:7px;padding:9px}.stat b{display:block;margin-top:5px;font-size:15px;color:#0f172a}table{border-collapse:collapse;width:100%;page-break-inside:auto}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left;vertical-align:top}th{background:#fff7ed;color:#9a3412;font-weight:700}tr{page-break-inside:avoid}tr:nth-child(even){background:#f8fafc}.empty{text-align:center;color:#64748b}@media print{section{break-inside:avoid}.stats{grid-template-columns:repeat(5,1fr)}}</style></head><body>
    <header><h1>BÁO CÁO THỐNG KÊ THƯ VIỆN UTT</h1><p class="muted">${esc(title)} · Ngày xuất: ${esc(generatedAt)}</p></header>
    <div class="stats"><div class="stat">Đầu sách<b>${esc(overview.TongSach)}</b></div><div class="stat">Bản sách<b>${esc(overview.TongSoLuongSach)}</b></div><div class="stat">Độc giả<b>${esc(overview.TongDocGia)}</b></div><div class="stat">Phiếu mượn<b>${esc(overview.TongPhieuMuon)}</b></div><div class="stat">Tiền phạt<b>${esc(formatMoney(overview.TongTienPhatDaThu))}</b></div></div>
    ${table("Diễn biến mượn trả theo thời gian", ["Ngày", "Số phiếu mượn", "Tiền phạt phát sinh"], timeline.map((item) => [item.label, item.loans, formatMoney(item.fines)]))}
    ${table("Phiếu mượn quá hạn cần xử lý", ["Mã phiếu", "Độc giả", "Hạn trả", "Trễ hạn (ngày)"], overdueTickets.map((item) => [item.MaMT, item.TenDG ?? item.MaDG, formatDate(item.HanTra), item.overdueDays]))}
    ${table("Top sách được mượn nhiều", ["Mã sách", "Tên sách", "Lượt mượn"], topBooks.map((item) => [item.MaSach, item.TenSach, item.TongLuotMuon ?? 0]))}
    ${table("Top độc giả mượn nhiều", ["Mã độc giả", "Tên độc giả", "Số phiếu mượn"], topReaders.map((item) => [item.MaDG, item.TenDG, item.TongPhieuMuon ?? 0]))}
  </body></html>`;
}

export function exportDashboardExcel(data) {
  const blob = new Blob(["\ufeff", reportHtml(data)], { type: "application/vnd.ms-excel;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bao-cao-thong-ke-thu-vien.xls";
  link.click();
  URL.revokeObjectURL(link.href);
}

export function printDashboardPdf(data) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.write(reportHtml(data));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
  return true;
}
