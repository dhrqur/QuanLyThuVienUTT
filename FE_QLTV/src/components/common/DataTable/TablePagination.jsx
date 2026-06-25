import { Button } from "@/components/ui/button";

function TablePagination({ currentPage, onPageChange, pageSize, totalRows }) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const firstRow = (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-500">
        Hiển thị {firstRow}-{lastRow} trên {totalRows} bản ghi
      </p>

      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
          variant="outline"
        >
          Trước
        </Button>
        <span className="min-w-20 text-center text-sm font-bold text-slate-700">
          {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
          variant="outline"
        >
          Sau
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;
