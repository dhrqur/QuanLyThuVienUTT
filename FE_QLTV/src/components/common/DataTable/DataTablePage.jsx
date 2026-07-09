import { useMemo, useState } from "react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { getColumnWidth } from "@/components/common/dataTableUtils";
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
    rows: tableRows,
    setRows: setTableRows,
    updateRow,
  } = useEntityTable({
    apiModule,
    columns,
    entityName,
  });

  const tableSettings = useMemo(() => {
    const tableColumns = columns.filter((column) => !column.tableHidden);
    const compactTable = tableColumns.length >= 7;
    const actionWidth = compactTable ? 170 : 164;
    const tableMinWidth = Math.max(
      720,
      tableColumns.reduce(
        (total, column) => total + getColumnWidth(column, compactTable),
        actionWidth,
      ),
    );

    return { actionWidth, compactTable, tableColumns, tableMinWidth };
  }, [columns]);

  const totalPages = pagination ? Math.max(1, Math.ceil(tableRows.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const displayedRows = pagination
    ? tableRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : tableRows;

  function handleResetSearch() {
    setSearchInput("");
    setPage(1);
    loadRows();
    toast.info("Đã đặt lại bộ lọc");
  }

  function handleSearch() {
    const keyword = searchInput.trim();
    setPage(1);
    loadRows(keyword);
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          </div>
          <EntityFormDialog
            buildExtraPayload={buildExtraPayload}
            columns={columns}
            entityName={entityName}
            mode="create"
            onSave={createRow}
            renderFormExtra={renderFormExtra}
            rows={tableRows}
            title={`Thêm ${entityName.toLowerCase()}`}
          />
        </section>

        <DataSearchCard
          onChange={setSearchInput}
          onReset={handleResetSearch}
          onSearch={handleSearch}
          searchInput={searchInput}
          searchPlaceholder={searchPlaceholder}
        />

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <DataTableCard
            actionWidth={tableSettings.actionWidth}
            allColumns={columns}
            buildExtraPayload={buildExtraPayload}
            columns={tableSettings.tableColumns}
            compactTable={tableSettings.compactTable}
            entityName={entityName}
            onDelete={deleteRow}
            onEdit={updateRow}
            renderDetailExtra={renderDetailExtra}
            renderFormExtra={renderFormExtra}
            rows={tableRows}
            setRows={setTableRows}
            tableMinWidth={tableSettings.tableMinWidth}
            visibleRows={displayedRows}
          />
        )}

        {!loading && pagination && tableRows.length > 0 ? (
          <TablePagination
            currentPage={currentPage}
            onPageChange={setPage}
            pageSize={pageSize}
            totalRows={tableRows.length}
          />
        ) : null}
      </div>
    </MainLayout>
  );
}

export default DataTablePage;
