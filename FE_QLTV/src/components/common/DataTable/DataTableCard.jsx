import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getColumnWidth,
  getDisplayValue,
  getRowKey,
} from "@/components/common/dataTableUtils";
import StatusBadge from "@/components/common/StatusBadge";
import EntityDeleteDialog from "@/components/common/DataTable/EntityDeleteDialog";
import EntityDetailDialog from "@/components/common/DataTable/EntityDetailDialog";
import EntityFormDialog from "@/components/common/DataTable/EntityFormDialog";
import TruncatedText from "@/components/common/DataTable/TruncatedText";

function DataTableCard({
  actionWidth,
  allColumns,
  columns,
  compactTable,
  entityName,
  onDelete,
  onEdit,
  renderDetailExtra,
  renderFormExtra,
  rows,
  setRows,
  tableMinWidth,
  visibleRows,
}) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
      <CardContent>
        <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200">
          <Table className="table-fixed text-[13px]" style={{ minWidth: `${tableMinWidth}px` }}>
            <TableHeader className="bg-orange-500">
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    className="h-9 px-2 font-bold text-white"
                    key={column.key}
                    style={{ width: `${getColumnWidth(column, compactTable)}px` }}
                  >
                    {column.tableLabel ?? column.displayLabel ?? column.label}
                  </TableHead>
                ))}
                <TableHead
                  className="sticky right-0 z-10 bg-orange-500 px-2 text-center font-bold text-white shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)]"
                  style={{ maxWidth: `${actionWidth}px`, minWidth: `${actionWidth}px`, width: `${actionWidth}px` }}
                >
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={getRowKey(row, allColumns)}>
                  {columns.map((column, index) => (
                    <DataCell column={column} index={index} key={column.key} row={row} />
                  ))}
                  <TableCell
                    className="sticky right-0 z-10 bg-white px-1.5 py-2 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]"
                    style={{ maxWidth: `${actionWidth}px`, minWidth: `${actionWidth}px`, width: `${actionWidth}px` }}
                  >
                    <div className="flex justify-center gap-1 overflow-visible">
                      <EntityDetailDialog
                        columns={allColumns}
                        entityName={entityName}
                        renderDetailExtra={renderDetailExtra}
                        row={row}
                        updateRow={(updates) => setRows((currentRows) => currentRows.map((item) => (item === row ? { ...item, ...updates } : item)))}
                      />
                      <EntityFormDialog
                        columns={allColumns}
                        entityName={entityName}
                        mode="edit"
                        onSave={(updatedRow) => onEdit(row, updatedRow)}
                        renderFormExtra={renderFormExtra}
                        row={row}
                        rows={rows}
                        title="Sửa"
                      />
                      <EntityDeleteDialog
                        entityName={entityName}
                        onDelete={() => onDelete(row)}
                        primaryColumn={allColumns.find((column) => column.primaryKey) ?? allColumns[0]}
                        row={row}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell className="py-8 text-center font-medium text-slate-500" colSpan={columns.length + 1}>
                    Không tìm thấy dữ liệu phù hợp.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DataCell({ column, index, row }) {
  const value = getDisplayValue(column, row);

  return (
    <TableCell className={`px-2 py-2 ${index === 0 ? "font-bold text-slate-900" : ""}`}>
      {column.badge ? (
        <StatusBadge status={value} />
      ) : (
        <TruncatedText value={value} />
      )}
    </TableCell>
  );
}

export default DataTableCard;
