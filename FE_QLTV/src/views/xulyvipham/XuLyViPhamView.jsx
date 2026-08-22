import DataTablePage from "@/components/common/DataTable/DataTablePage";
import { formatCurrency } from "@/utils/numberUtils";

const TYPE_LABELS = { QUA_HAN: "Quá hạn", HU_HONG: "Hư hỏng", LAM_MAT: "Làm mất" };
const STATUS_LABELS = { CHUA_THU: "Chưa thu", DA_THU: "Đã thu", MIEN_PHAT: "Miễn phạt" };

function XuLyViPhamView() {
  return (
    <DataTablePage
      allowCreate={false}
      allowDelete={false}
      apiModule="xulyvipham"
      columns={[
        { key: "MaVP", label: "Mã VP", primaryKey: true, formHidden: true, displayValue: (row) => `VP${String(row.MaVP).padStart(6, "0")}`, widthValue: 100 },
        { key: "MaMT", label: "Phiếu mượn", formHidden: true, widthValue: 105 },
        { key: "MaDG", label: "Mã độc giả", tableHidden: true, formHidden: true },
        { key: "TenDG", label: "Độc giả", formHidden: true, widthValue: 170 },
        { key: "NoiDung", label: "Nội dung vi phạm", formHidden: true, displayValue: (row) => row.MaSach ? `${TYPE_LABELS[row.LoaiViPham]} · ${row.TenSach} (${row.MaSach})` : `${TYPE_LABELS[row.LoaiViPham]} · Toàn phiếu`, widthValue: 260 },
        { key: "MaSach", label: "Mã sách", tableHidden: true, formHidden: true, required: false },
        { key: "TenSach", label: "Tên sách", tableHidden: true, formHidden: true, required: false },
        { key: "LoaiViPham", label: "Loại vi phạm", tableHidden: true, formHidden: true, displayValue: (row) => TYPE_LABELS[row.LoaiViPham] ?? row.LoaiViPham },
        { key: "SoLuong", label: "SL", inputType: "number", formHidden: true, displayValue: (row) => row.SoLuong ? row.SoLuong : "—", widthValue: 70 },
        { key: "SoTien", label: "Tiền phạt", inputType: "number", formHidden: true, displayValue: (row) => formatCurrency(row.SoTien), widthValue: 120 },
        { key: "MoTa", label: "Ghi chú xử lý", required: false, tableHidden: true },
        { key: "TrangThaiThu", label: "Trạng thái thu", badge: true, options: [
          { value: "CHUA_THU", label: "Chưa thu" }, { value: "DA_THU", label: "Đã thu" }, { value: "MIEN_PHAT", label: "Miễn phạt" },
        ], displayValue: (row) => STATUS_LABELS[row.TrangThaiThu] ?? row.TrangThaiThu, widthValue: 130 },
        { key: "NgayLap", label: "Ngày phát sinh", inputType: "date", formHidden: true, widthValue: 125 },
        { key: "NgayThu", label: "Ngày thu", inputType: "date", formHidden: true, tableHidden: true },
        { key: "MaNVThu", label: "NV thu", formHidden: true, tableHidden: true, required: false },
        { key: "TenNVThu", label: "Người thu", formHidden: true, displayValue: (row) => row.TenNVThu || (row.TrangThaiThu === "CHUA_THU" ? "Chưa thu" : "Không ghi nhận"), required: false, widthValue: 140 },
      ]}
      editLabel="Xử lý"
      entityName="Vi phạm"
      pagination
      pageSize={10}
      searchPlaceholder="Tìm mã phiếu, độc giả, sách hoặc trạng thái..."
      title="Quản lý xử lý vi phạm"
    />
  );
}

export default XuLyViPhamView;
