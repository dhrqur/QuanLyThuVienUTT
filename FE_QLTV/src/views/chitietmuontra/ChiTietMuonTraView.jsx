import DataTablePage from "@/components/common/DataTablePage";
import { useApiLists } from "@/hooks/useApiLists";
import { createLookup } from "@/utils/lookup";

function ChiTietMuonTraView() {
  const { data } = useApiLists(["sach", "muontra"]);
  const books = data.sach ?? [];
  const borrowTickets = data.muontra ?? [];
  const bookNames = createLookup(books, "MaSach", "TenSach");

  return (
    <DataTablePage
      apiModule="chitietmuontra"
      columns={[
        {
          key: "MaMT", label: "MaMT", displayLabel: "Mã mượn trả", primaryKey: true,
          options: borrowTickets.map((ticket) => ({ label: ticket.MaMT, value: ticket.MaMT })),
          widthValue: 130,
        },
        {
          key: "MaSach", label: "MaSach", displayLabel: "Sách", primaryKey: true,
          displayValue: (row) => bookNames[row.MaSach] ?? row.MaSach,
          options: books.map((book) => ({ label: `${book.MaSach} - ${book.TenSach}`, value: book.MaSach })),
          widthValue: 250,
        },
        { key: "SoLuong", label: "SoLuong", displayLabel: "Số lượng", inputType: "number", widthValue: 120 },
      ]}
      entityName="Chi tiết mượn trả"
      pagination
      pageSize={10}
      searchPlaceholder="Tìm mã phiếu hoặc tên sách..."
      title="Chi tiết Mượn trả"
    />
  );
}

export default ChiTietMuonTraView;
