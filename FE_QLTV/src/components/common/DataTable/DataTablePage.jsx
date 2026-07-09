import { useState } from "react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import DataSearchCard from "@/components/common/DataTable/DataSearchCard";
import DataTableCard from "@/components/common/DataTable/DataTableCard";
import EntityFormDialog from "@/components/common/DataTable/EntityFormDialog";
import TablePagination from "@/components/common/DataTable/TablePagination";
import { useEntityTable } from "@/hooks/useEntityTable";

function DataTablePage({
  apiModule,
  title,
  entityName,
  buildExtraPayload,
  columns,
  pagination = false,
  pageSize = 10,
  renderDetailExtra,
  renderFormExtra,
  searchPlaceholder = "Tìm kiếm...",
}) {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const {
    createRow,
    deleteRow,
    error,
    loadRows,
    loading,
    rows,
    setRows,
    updateRow,
  } = useEntityTable({
    apiModule,
    columns,
    entityName,
  });

  const tableColumns = columns.filter((column) => !column.tableHidden);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const visibleRows = pagination ? rows.slice(startIndex, endIndex) : rows;

  function handleSearch() {
    setPage(1);
    loadRows(searchInput.trim());
  }

  function handleResetSearch() {
    setSearchInput("");
    setPage(1);
    loadRows();
    toast.info("Đã đặt lại tìm kiếm");
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <EntityFormDialog
            buildExtraPayload={buildExtraPayload}
            columns={columns}
            entityName={entityName}
            mode="create"
            onSave={createRow}
            renderFormExtra={renderFormExtra}
            rows={rows}
            title={`Thêm ${entityName.toLowerCase()}`}
          />
        </div>

        <DataSearchCard
          onChange={setSearchInput}
          onReset={handleResetSearch}
          onSearch={handleSearch}
          searchInput={searchInput}
          searchPlaceholder={searchPlaceholder}
        />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <DataTableCard
            allColumns={columns}
            buildExtraPayload={buildExtraPayload}
            columns={tableColumns}
            entityName={entityName}
            onDelete={deleteRow}
            onEdit={updateRow}
            renderDetailExtra={renderDetailExtra}
            renderFormExtra={renderFormExtra}
            rows={rows}
            setRows={setRows}
            visibleRows={visibleRows}
          />
        )}

        {!loading && pagination && rows.length > 0 ? (
          <TablePagination
            currentPage={currentPage}
            onPageChange={setPage}
            pageSize={pageSize}
            totalRows={rows.length}
          />
        ) : null}
      </div>
    </MainLayout>
  );
}

export default DataTablePage;
