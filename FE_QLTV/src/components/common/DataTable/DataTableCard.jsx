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
  allColumns,
  buildExtraPayload,
  columns,
  entityName,
  onDelete,
  onEdit,
  renderDetailExtra,
  renderFormExtra,
  rows,
  setRows,
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
                {column.tableLabel ?? column.displayLabel ?? column.label}
              </TableHead>
            ))}
            <TableHead className="text-center font-bold text-white">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={getRowKey(row, allColumns)}>
              {columns.map((column) => (
                <DataCell column={column} key={column.key} row={row} />
              ))}
              <TableCell>
                <div className="flex justify-center gap-2">
                  <EntityDetailDialog
                    columns={allColumns}
                    entityName={entityName}
                    renderDetailExtra={renderDetailExtra}
                    row={row}
                    updateRow={(updates) => updateRowInTable(row, updates)}
                  />
                  <EntityFormDialog
                    buildExtraPayload={buildExtraPayload}
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

function DataCell({ column, row }) {
  const value = getDisplayValue(column, row);

  return (
    <TableCell>
      {column.badge ? <StatusBadge status={value} /> : <TruncatedText value={value} />}
    </TableCell>
  );
}

export default DataTableCard;
