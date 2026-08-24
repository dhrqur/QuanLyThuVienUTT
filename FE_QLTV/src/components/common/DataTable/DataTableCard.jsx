import { ArrowDownAZ, ArrowDownZA, ChevronsUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getDisplayValue,
  getRowKey,
} from "@/components/common/dataTableUtils";
import StatusBadge from "@/components/common/StatusBadge";
import EntityDeleteDialog from "@/components/common/DataTable/EntityDeleteDialog";
import EntityDetailDialog from "@/components/common/DataTable/EntityDetailDialog";
import EntityFormDialog from "@/components/common/DataTable/EntityFormDialog";
import TruncatedText from "@/components/common/DataTable/TruncatedText";

function DataTableCard({
  allowDelete,
  allowEdit,
  actionsLabel,
  allColumns,
  buildExtraPayload,
  columns,
  entityName,
  editLabel,
  onDelete,
  onEdit,
  onSort,
  renderDetailExtra,
  renderFormExtra,
  rows,
  setRows,
  sortConfig,
  visibleRows,
}) {
  function updateRowInTable(row, updates) {
    setRows((currentRows) =>
      currentRows.map((item) => {
        if (item !== row) return item;
        return { ...item, ...updates };
      }),
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader className="bg-orange-500">
          <TableRow>
            {columns.map((column) => (
              <TableHead className="font-bold text-white" key={column.key}>
                <button
                  className="inline-flex w-full items-center gap-1.5 text-left transition hover:text-orange-100 disabled:cursor-default"
                  disabled={column.sortable === false}
                  onClick={() => onSort(column)}
                  title="Bấm để sắp xếp tăng dần, giảm dần hoặc trở về mặc định"
                  type="button"
                >
                  <span>{column.tableLabel ?? column.displayLabel ?? column.label}</span>
                  <SortIcon column={column} sortConfig={sortConfig} />
                </button>
              </TableHead>
            ))}
            <TableHead className="sticky right-0 z-10 bg-orange-500 text-center font-bold text-white">{actionsLabel}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={getRowKey(row, allColumns)}>
              {columns.map((column) => (
                <DataCell column={column} key={column.key} row={row} />
              ))}
              <TableCell className="sticky right-0 z-10 bg-white shadow-[-8px_0_12px_-12px_rgba(15,23,42,.35)]">
                <div className="flex justify-center gap-2">
                  <EntityDetailDialog
                    columns={allColumns}
                    entityName={entityName}
                    renderDetailExtra={renderDetailExtra}
                    row={row}
                    updateRow={(updates) => updateRowInTable(row, updates)}
                  />
                  {allowEdit ? <EntityFormDialog
                    buildExtraPayload={buildExtraPayload}
                    columns={allColumns}
                    entityName={entityName}
                    mode="edit"
                    onSave={(updatedRow) => onEdit(row, updatedRow)}
                    renderFormExtra={renderFormExtra}
                    row={row}
                    rows={rows}
                    title={editLabel}
                  /> : null}
                  {allowDelete ? <EntityDeleteDialog
                    entityName={entityName}
                    onDelete={() => onDelete(row)}
                    primaryColumn={allColumns.find((column) => column.primaryKey) ?? allColumns[0]}
                    row={row}
                  /> : null}
                </div>
              </TableCell>
            </TableRow>
          ))}

          {visibleRows.length === 0 ? (
            <TableRow>
              <TableCell className="py-8 text-center text-slate-500" colSpan={columns.length + 1}>
                Không tìm thấy dữ liệu phù hợp.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function SortIcon({ column, sortConfig }) {
  if (column.sortable === false) return null;
  if (sortConfig?.key !== column.key) return <ChevronsUpDown className="size-3.5 opacity-60" />;
  return sortConfig.direction === "asc"
    ? <ArrowDownAZ className="size-4" />
    : <ArrowDownZA className="size-4" />;
}

function DataCell({ column, row }) {
  const value = getDisplayValue(column, row);

  return (
    <TableCell>
      {column.badge ? <StatusBadge status={value} /> : <TruncatedText value={value} />}
    </TableCell>
  );
}

export default DataTableCard;
