export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("vi-VN").format(date);
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function requestStatus(status) {
  const definitions = {
    CHO_DUYET: ["Chờ duyệt", "border-amber-200 bg-amber-50 text-amber-700"],
    DA_DUYET: ["Đã duyệt", "border-emerald-200 bg-emerald-50 text-emerald-700"],
    DA_LAY: ["Đã lấy", "border-cyan-200 bg-cyan-50 text-cyan-700"],
    TU_CHOI: ["Từ chối", "border-rose-200 bg-rose-50 text-rose-700"],
    DA_HUY: ["Đã hủy", "border-slate-200 bg-slate-50 text-slate-600"],
  };
  return definitions[status] || [status || "Chưa rõ", "border-slate-200 bg-slate-50 text-slate-600"];
}
