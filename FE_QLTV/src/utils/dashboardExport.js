import { formatCurrency } from "@/utils/numberUtils";
import { formatDisplayDate } from "@/utils/dateUtils";

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const formatDate = (value) => formatDisplayDate(String(value ?? "").slice(0, 10)) || "—";

function table(title, headers, rows) {
  const body = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")
    : `<tr><td class="empty" colspan="${headers.length}">Chưa có dữ liệu.</td></tr>`;
  return `<section><h2>${esc(title)}</h2><table><thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></section>`;
}

function chartSvg(timeline, title) {
  const width = 1100;
  const height = 330;
  const plot = { left: 48, right: 22, top: 48, bottom: 42 };
  const chartWidth = width - plot.left - plot.right;
  const chartHeight = height - plot.top - plot.bottom;
  const maximum = Math.max(...timeline.flatMap((item) => [Number(item.loans), Number(item.returns)]), 1);
  const groupWidth = chartWidth / Math.max(timeline.length, 1);
  const barWidth = Math.max(Math.min(groupWidth * 0.32, 12), 1.5);
  const tickStep = Math.max(Math.ceil(timeline.length / 12), 1);
  const grid = Array.from({ length: 5 }, (_, index) => {
    const value = Math.round(maximum / 4 * index);
    const y = plot.top + chartHeight - value / maximum * chartHeight;
    return `<line x1="${plot.left}" y1="${y}" x2="${width - plot.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4 4"/><text x="${plot.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748b">${value}</text>`;
  }).join("");
  const bars = timeline.map((item, index) => {
    const center = plot.left + groupWidth * index + groupWidth / 2;
    const loanHeight = Number(item.loans) / maximum * chartHeight;
    const returnHeight = Number(item.returns) / maximum * chartHeight;
    const label = index % tickStep === 0 || index === timeline.length - 1
      ? `<text x="${center}" y="${height - 17}" text-anchor="middle" font-size="9" fill="#64748b">${esc(String(item.date).slice(5).split("-").reverse().join("/"))}</text>`
      : "";
    return `<rect x="${center - barWidth - 1}" y="${plot.top + chartHeight - loanHeight}" width="${barWidth}" height="${loanHeight}" rx="2" fill="#F1663D"/><rect x="${center + 1}" y="${plot.top + chartHeight - returnHeight}" width="${barWidth}" height="${returnHeight}" rx="2" fill="#10b981"/>${label}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><text x="${plot.left}" y="25" font-family="Arial" font-size="16" font-weight="700" fill="#0f172a">${esc(title)}</text><circle cx="${width - 175}" cy="21" r="5" fill="#F1663D"/><text x="${width - 164}" y="25" font-family="Arial" font-size="11" fill="#475569">Mượn</text><circle cx="${width - 92}" cy="21" r="5" fill="#10b981"/><text x="${width - 81}" y="25" font-family="Arial" font-size="11" fill="#475569">Trả</text>${grid}${bars}</svg>`;
}

function reportHtml({ activityTitle, attentionBooks = [], overview, overdueTickets, timeline, title, topBooks }) {
  const generatedAt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date());
  const activeTimeline = timeline.filter((item) => Number(item.loans) > 0 || Number(item.returns) > 0);
  const inactiveDays = timeline.length - activeTimeline.length;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    @page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;color:#172033;font-size:11px}header{border-bottom:3px solid #f1663d;padding-bottom:11px}h1{margin:0;color:#c2410c;font-size:22px}h2{margin:22px 0 8px;color:#9a3412;font-size:14px}.muted{color:#64748b}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:14px}.stat{border:1px solid #fed7aa;border-radius:7px;padding:8px}.stat b{display:block;margin-top:5px;font-size:15px;color:#0f172a}.fine{display:flex;justify-content:space-between;gap:12px;margin-top:9px;border:1px solid #a7f3d0;border-radius:7px;background:#ecfdf5;padding:9px;color:#047857}.fine b{color:#065f46}.chart{margin-top:18px}.chart svg{display:block;width:100%;height:auto}.note{margin:6px 0 0;color:#64748b;font-style:italic}table{border-collapse:collapse;width:100%;page-break-inside:auto}th,td{border:1px solid #cbd5e1;padding:6px;text-align:left;vertical-align:top}th{background:#fff7ed;color:#9a3412;font-weight:700}tr{page-break-inside:avoid}tr:nth-child(even){background:#f8fafc}.empty{text-align:center;color:#64748b}@media print{section{break-inside:avoid}.stats{grid-template-columns:repeat(5,1fr)}}</style></head><body>
    <header><h1>BÁO CÁO DASHBOARD THƯ VIỆN UTT</h1><p class="muted">${esc(title)} · Ngày xuất: ${esc(generatedAt)}</p></header>
    <div class="stats"><div class="stat">Đầu sách<b>${esc(overview.TongSach)}</b></div><div class="stat">Tổng bản sách<b>${esc(overview.TongSoLuongSach)}</b></div><div class="stat">Đang lưu thông<b>${esc(overview.SoBanDangMuon)}</b></div><div class="stat">Phiếu quá hạn<b>${esc(overview.PhieuQuaHan)}</b></div><div class="stat">Cần bổ sung<b>${esc(overview.DauSachCanBoSung)}</b></div></div>
    <div class="fine"><span>Chưa thu (${esc(overview.SoViPhamChuaThu ?? 0)} vi phạm): <b>${esc(formatCurrency(overview.TienPhatChuaThu))}</b></span><span>Đã thu trong kỳ: <b>${esc(formatCurrency(overview.TienPhatTrongKy))}</b></span><span>Lũy kế đã thu: <b>${esc(formatCurrency(overview.TongTienPhatDaThu))}</b></span></div>
    ${table("Chỉ số phát sinh trong kỳ", ["Chỉ số", "Kỳ hiện tại", "Kỳ liền trước"], [["Số bản được mượn", overview.BanMuonTrongKy, overview.BanMuonKyTruoc], ["Tiền phạt đã thu", formatCurrency(overview.TienPhatTrongKy), formatCurrency(overview.TienPhatKyTruoc)], ["Phiếu phát sinh quá hạn", overview.PhieuQuaHanTrongKy, "—"]])}
    <section class="chart">${chartSvg(timeline, activityTitle)}</section>
    ${table("Chi tiết ngày có phát sinh", ["Ngày", "Lượt mượn", "Lượt trả"], activeTimeline.map((item) => [formatDate(item.date), item.loans, item.returns]))}
    ${inactiveDays ? `<p class="note">${inactiveDays} ngày còn lại trong kỳ không phát sinh lượt mượn hoặc trả.</p>` : ""}
    ${table("Phiếu mượn quá hạn cần xử lý", ["Mã phiếu", "Độc giả", "Ngày mượn", "Hạn trả", "Số sách", "Trễ hạn (ngày)"], overdueTickets.map((item) => [item.MaMT, item.TenDG ?? item.MaDG, formatDate(item.NgayMuon), formatDate(item.HanTra), item.TongSoLuong, item.overdueDays]))}
    ${table("Top sách được mượn nhiều", ["Mã sách", "Tên sách", "Lượt mượn"], topBooks.map((item) => [item.MaSach, item.TenSach, item.TongLuotMuon ?? 0]))}
    ${table("Sách cần kiểm tra và bổ sung", ["Mã sách", "Tên sách", "Số bản còn", "Trạng thái"], attentionBooks.map((item) => [item.MaSach, item.TenSach, item.SoLuong, item.TrangThai]))}
  </body></html>`;
}

function download(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

function addTableSheet(workbook, name, headers, rows, widths = []) {
  const sheet = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.addRow(headers);
  rows.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FF9A3412" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7ED" } };
  });
  sheet.columns.forEach((column, index) => {
    column.width = widths[index] ?? 18;
    column.alignment = { vertical: "middle", wrapText: true };
  });
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
  return sheet;
}

async function svgToPng(svg) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 2200;
    canvas.height = 660;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.drawImage(image, 0, 0, 1100, 330);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportDashboardExcel(data) {
  const { default: ExcelJS } = await import("exceljs");
  const { activityTitle, attentionBooks = [], overview, overdueTickets, timeline, title, topBooks } = data;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Thư viện UTT";
  workbook.created = new Date();
  const summaryRows = [
    ["Kỳ báo cáo", title], ["Tổng đầu sách", overview.TongSach], ["Tổng bản sách", overview.TongSoLuongSach],
    ["Bản đang lưu thông", overview.SoBanDangMuon], ["Phiếu quá hạn", overview.PhieuQuaHan],
    ["Đầu sách cần bổ sung", overview.DauSachCanBoSung], ["Bản được mượn trong kỳ", overview.BanMuonTrongKy],
    ["Bản được mượn kỳ liền trước", overview.BanMuonKyTruoc], ["Phiếu phát sinh quá hạn trong kỳ", overview.PhieuQuaHanTrongKy],
    ["Tiền phạt đã thu trong kỳ", overview.TienPhatTrongKy], ["Tiền phạt kỳ liền trước", overview.TienPhatKyTruoc],
    ["Số vi phạm chưa thu", overview.SoViPhamChuaThu], ["Tiền phạt chưa thu", overview.TienPhatChuaThu],
    ["Tổng tiền phạt đã thu lũy kế", overview.TongTienPhatDaThu],
  ];
  const summarySheet = addTableSheet(workbook, "Tổng quan", ["Chỉ số", "Giá trị"], summaryRows, [34, 30]);
  const imageId = workbook.addImage({ base64: await svgToPng(chartSvg(timeline, activityTitle)), extension: "png" });
  summarySheet.addImage(imageId, { tl: { col: 3, row: 1 }, ext: { width: 825, height: 248 } });
  addTableSheet(workbook, "Mượn trả theo ngày", ["Ngày", "Lượt mượn", "Lượt trả"], timeline.map((item) => [formatDate(item.date), item.loans, item.returns]), [16, 16, 16]);
  addTableSheet(workbook, "Phiếu quá hạn", ["Mã phiếu", "Mã độc giả", "Tên độc giả", "Ngày mượn", "Hạn trả", "Số sách", "Ngày quá hạn", "SĐT", "Email"], overdueTickets.map((item) => [item.MaMT, item.MaDG, item.TenDG, formatDate(item.NgayMuon), formatDate(item.HanTra), item.TongSoLuong, item.overdueDays, item.Sdt, item.Email]), [14, 14, 25, 14, 14, 12, 14, 16, 28]);
  addTableSheet(workbook, "Top sách", ["Mã sách", "Tên sách", "Lượt mượn"], topBooks.map((item) => [item.MaSach, item.TenSach, item.TongLuotMuon ?? 0]), [14, 42, 16]);
  addTableSheet(workbook, "Sách cần bổ sung", ["Mã sách", "Tên sách", "Số bản còn", "Trạng thái"], attentionBooks.map((item) => [item.MaSach, item.TenSach, item.SoLuong, item.TrangThai]), [14, 42, 16, 18]);
  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  download(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `dashboard-thu-vien-${date}.xlsx`);
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
