import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDisplayValue } from "@/components/common/dataTableUtils";

function EntityDetailDialog({ columns, entityName, renderDetailExtra, row, updateRow }) {
  const visibleColumns = columns.filter((column) => !column.detailHidden && !column.tableHidden);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border-slate-200 bg-white px-1.5 text-slate-700 hover:bg-slate-50" size="xs" variant="outline">
          <Eye className="size-3" />
          Xem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b border-slate-100 px-6 py-5">
          <DialogTitle className="text-xl font-extrabold text-slate-900">
            Chi tiết {entityName.toLowerCase()}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Thông tin chi tiết {entityName.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[65vh] overflow-y-auto px-6 py-5">
          {visibleColumns.map((column) => (
            <div className="grid grid-cols-[160px_1fr] border-b border-slate-100 py-3 text-sm" key={column.key}>
              <span className="font-bold text-slate-600">{column.displayLabel ?? column.label}</span>
              <span className="font-medium text-slate-900">{getDisplayValue(column, row)}</span>
            </div>
          ))}
          {renderDetailExtra?.({ row, updateRow })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EntityDetailDialog;
