const BADGE_DEFINITIONS = {
  available: {
    label: "Còn",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    aliases: ["con", "co san", "available"],
  },
  unavailable: {
    label: "Hết",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    aliases: ["het", "het sach", "unavailable"],
  },
  lowStock: {
    label: "Sắp hết",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    aliases: ["sap het", "sap het sach", "low stock"],
  },
  active: {
    label: "Còn hiệu lực",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    aliases: ["con hieu luc", "dang hoat dong", "hoat dong", "active"],
  },
  expired: {
    label: "Hết hạn",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    aliases: ["het han", "expired"],
  },
  locked: {
    label: "Tạm khóa",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    aliases: ["tam khoa", "khoa", "bi khoa", "locked"],
  },
  borrowing: {
    label: "Đang mượn",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    aliases: ["dang muon", "borrowing"],
  },
  notReturned: {
    label: "Chưa trả",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    aliases: ["chua tra", "chua hoan tra", "not returned"],
  },
  returned: {
    label: "Đã trả",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    aliases: ["da tra", "tra", "returned"],
  },
  overdue: {
    label: "Quá hạn",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    aliases: ["qua han", "overdue"],
  },
  manager: {
    label: "Quản lý",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    aliases: ["quan ly", "quan ly thu vien", "admin", "manager"],
  },
  librarian: {
    label: "Thủ thư",
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
    aliases: ["thu thu", "librarian"],
  },
  pending: {
    label: "Đang chờ",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    aliases: ["dang cho", "cho duyet", "pending"],
  },
  approved: {
    label: "Đã duyệt",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    aliases: ["da duyet", "approved"],
  },
  cancelled: {
    label: "Đã hủy",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    aliases: ["da huy", "huy", "cancelled", "canceled"],
  },
};

function normalizeBadgeStatus(status) {
  const normalizedStatus = normalizeText(status);
  const definition = Object.values(BADGE_DEFINITIONS).find(({ aliases }) =>
    aliases.includes(normalizedStatus),
  );

  return definition
    ? { label: definition.label, className: definition.className }
    : {
        label: status || "Chưa có",
        className: "border-slate-200 bg-slate-50 text-slate-700",
      };
}

function StatusBadge({ className = "", status }) {
  const normalized = normalizeBadgeStatus(status);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        normalized.className,
        className,
      ].join(" ")}
    >
      {normalized.label}
    </span>
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase();
}

export default StatusBadge;
