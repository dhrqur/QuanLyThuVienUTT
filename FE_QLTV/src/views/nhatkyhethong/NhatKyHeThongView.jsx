import DataTablePage from "@/components/common/DataTable/DataTablePage";

const ACTION_LABELS = {
  THEM: "Thêm",
  CAP_NHAT: "Cập nhật",
  XOA: "Xóa",
  TRA_SACH: "Trả sách & thu tiền",
  XU_LY_VI_PHAM: "Xử lý vi phạm",
  CAP_NHAT_QUY_DINH: "Cập nhật quy định",
};

function NhatKyHeThongView() {
  return (
    <DataTablePage
      allowCreate={false}
      allowDelete={false}
      allowEdit={false}
      actionsLabel="Chi tiết"
      apiModule="nhatkyhethong"
      columns={[
        {
          key: "MaNK",
          label: "Mã nhật ký",
          primaryKey: true,
          tableHidden: true,
          displayValue: (row) => `NK${String(row.MaNK).padStart(6, "0")}`,
        },
        {
          key: "ThoiGian",
          label: "Thời gian",
          displayValue: (row) => formatTimestamp(row.ThoiGian),
          sortValue: (row) => row.ThoiGian,
          widthValue: 165,
        },
        { key: "MaNV", label: "Mã NV", tableHidden: true, detailHidden: true },
        {
          key: "TenNguoiThucHien",
          label: "Người thực hiện",
          displayValue: (row) => row.TenNguoiThucHien || "Không xác định",
          widthValue: 190,
        },
        {
          key: "HanhDong",
          label: "Hoạt động",
          badge: true,
          displayValue: (row) => ACTION_LABELS[row.HanhDong] ?? row.HanhDong,
          widthValue: 180,
        },
        { key: "DoiTuong", label: "Loại đối tượng", tableHidden: true },
        {
          key: "MaDoiTuong",
          label: "Đối tượng",
          displayValue: (row) => `${row.DoiTuong}${row.MaDoiTuong ? ` · ${row.MaDoiTuong}` : ""}`,
          widthValue: 190,
        },
        { key: "MoTa", label: "Nội dung", displayValue: getAuditDescription, widthValue: 280 },
        { key: "UserAgent", label: "Thiết bị", tableHidden: true, detailHidden: true },
      ]}
      entityName="Nhật ký hệ thống"
      pagination
      pageSize={15}
      renderDetailExtra={({ row }) => (
        <div className="space-y-4 pt-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <AuditMeta label="Thiết bị" value={row.UserAgent} />
          </div>
        </div>
      )}
      searchPlaceholder="Tìm nhân viên, hành động, đối tượng hoặc mã bản ghi..."
      title="Nhật ký hệ thống"
    />
  );
}

function AuditMeta({ label, value }) {
  return (
    <div>
      <span className="block text-xs font-bold text-slate-500">{label}</span>
      <span className="mt-1 block break-all font-semibold text-slate-800">{value || "—"}</span>
    </div>
  );
}

function getAuditDescription(row) {
  return row.MoTa;
}

function formatTimestamp(value) {
  if (!value) return "—";
  const [date, time = ""] = String(value).replace("T", " ").split(" ");
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}/${month}/${year}${time ? ` ${time.slice(0, 8)}` : ""}` : value;
}

export default NhatKyHeThongView;
