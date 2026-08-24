import { useMemo, useState } from "react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import DataSearchCard from "@/components/common/DataTable/DataSearchCard";
import DataTableCard from "@/components/common/DataTable/DataTableCard";
import EntityFormDialog from "@/components/common/DataTable/EntityFormDialog";
import ExcelActions from "@/components/common/DataTable/ExcelActions";
import TablePagination from "@/components/common/DataTable/TablePagination";
import { useEntityTable } from "@/hooks/useEntityTable";

function DataTablePage({
  apiModule,
  allowCreate = true,
  allowDelete = true,
  allowEdit = true,
  actionsLabel = "Hành động",
  title,
  entityName,
  editLabel = "Sửa",
  enableExcel,
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
  const [sortConfig, setSortConfig] = useState(null);

  const {
    createRow,
    deleteRow,
    error,
    importRows,
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

  const excelEnabled = enableExcel ?? ![
    "nhatkyhethong",
    "quydinhthuvien",
  ].includes(apiModule);
  const excelImportEnabled = allowCreate && !["muontra", "xulyvipham"].includes(apiModule);

  const tableColumns = columns.filter((column) => !column.tableHidden);
  const processedRows = useMemo(() => {
    if (!sortConfig) return rows;
    const sortColumn = tableColumns.find((column) => column.key === sortConfig.key);
    if (!sortColumn) return rows;

    return [...rows].sort((firstRow, secondRow) => {
      const comparison = compareValues(
        getComparableValue(sortColumn, firstRow),
        getComparableValue(sortColumn, secondRow),
        sortColumn,
      );
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortConfig, tableColumns]);
  const totalPages = Math.max(1, Math.ceil(processedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const visibleRows = pagination ? processedRows.slice(startIndex, endIndex) : processedRows;

  function handleSearch() {
    setPage(1);
    loadRows(searchInput.trim());
  }

  function handleResetSearch() {
    setSearchInput("");
    setSortConfig(null);
    setPage(1);
    loadRows();
    toast.info("Đã đặt lại tìm kiếm và sắp xếp");
  }

  function handleSort(column) {
    if (column.sortable === false) return;
    setPage(1);
    setSortConfig((current) => {
      if (!current || current.key !== column.key) return { key: column.key, direction: "asc" };
      if (current.direction === "asc") return { key: column.key, direction: "desc" };
      return null;
    });
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-black text-[#25245A]">{title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {excelEnabled ? (
              <ExcelActions
                allowImport={excelImportEnabled}
                apiModule={apiModule}
                buildExtraPayload={buildExtraPayload}
                columns={columns}
                entityName={entityName}
                onImport={importRows}
                rows={rows}
              />
            ) : null}
            {allowCreate ? <EntityFormDialog
              buildExtraPayload={buildExtraPayload}
              columns={columns}
              entityName={entityName}
              editLabel={editLabel}
              mode="create"
              onSave={createRow}
              renderFormExtra={renderFormExtra}
              rows={rows}
              title={`Thêm ${entityName.toLowerCase()}`}
            /> : null}
          </div>
        </div>

        <DataSearchCard
          hasActiveConditions={Boolean(sortConfig)}
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
            allowEdit={allowEdit}
            actionsLabel={actionsLabel}
            buildExtraPayload={buildExtraPayload}
            columns={tableColumns}
            entityName={entityName}
            onDelete={deleteRow}
            allowDelete={allowDelete}
            onEdit={updateRow}
            onSort={handleSort}
            renderDetailExtra={renderDetailExtra}
            renderFormExtra={renderFormExtra}
            rows={rows}
            setRows={setRows}
            sortConfig={sortConfig}
            visibleRows={visibleRows}
          />
        )}

        {!loading && pagination && processedRows.length > 0 ? (
          <TablePagination
            currentPage={currentPage}
            onPageChange={setPage}
            pageSize={pageSize}
            totalRows={processedRows.length}
          />
        ) : null}
      </div>
    </MainLayout>
  );
}

const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });

function getComparableValue(column, row) {
  if (column.sortValue) return column.sortValue(row) ?? "";
  if (column.displayValue) return column.displayValue(row) ?? "";
  return row[column.key] ?? "";
}

function compareValues(firstValue, secondValue, column) {
  if (column.inputType === "number" || (typeof firstValue === "number" && typeof secondValue === "number")) {
    return Number(firstValue ?? 0) - Number(secondValue ?? 0);
  }
  if (column.inputType === "date") {
    return String(firstValue ?? "").localeCompare(String(secondValue ?? ""));
  }
  return collator.compare(String(firstValue ?? ""), String(secondValue ?? ""));
}

export default DataTablePage;
