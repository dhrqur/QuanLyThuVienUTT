import { useRef, useState } from "react";
import { Download, FileDown, FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadEntityTemplate,
  exportEntityExcel,
  parseEntityExcel,
} from "@/utils/entityExcel";
import { api } from "@/lib/api";

function ExcelActions({ allowImport, apiModule, buildExtraPayload, columns, entityName, onImport, rows }) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleTemplateDownload() {
    setBusy(true);
    try {
      await downloadEntityTemplate({ columns, entityName });
    } catch (error) {
      toast.error("Không thể tạo file mẫu", { description: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    setBusy(true);
    try {
      await exportEntityExcel({ columns, entityName, rows });
      toast.success(`Đã xuất ${rows.length} dòng dữ liệu`);
    } catch (error) {
      toast.error("Xuất Excel thất bại", { description: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      const response = await api.getAll(apiModule);
      const importedRows = await parseEntityExcel({
        buildExtraPayload,
        columns,
        existingRows: response.data ?? [],
        file,
      });
      await onImport(importedRows);
      setOpen(false);
      toast.success(`Đã nhập thành công ${importedRows.length} dòng`);
    } catch (error) {
      toast.error("Nhập Excel thất bại", {
        description: error.message || "File không đúng mẫu hoặc dữ liệu không hợp lệ.",
        duration: 8000,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {allowImport ? (
          <Button
            className="border-blue-200 bg-blue-50 font-bold text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800"
            disabled={busy}
            onClick={() => setOpen(true)}
            type="button"
            variant="outline"
          >
            <Upload className="size-4" />
            Nhập Excel
          </Button>
        ) : null}
        <Button
          className="border-emerald-200 bg-emerald-50 font-bold text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
          disabled={busy}
          onClick={handleExport}
          type="button"
          variant="outline"
        >
          <FileDown className="size-4" />
          Xuất Excel
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nhập {entityName.toLowerCase()} từ Excel</DialogTitle>
            <DialogDescription>
              File phải đúng mẫu chuẩn của hệ thống thì mới nhập được.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-orange-600" />
              <div className="space-y-1">
                <p className="font-bold text-slate-900">Dùng đúng file mẫu được tải tại đây</p>
                <p>Không đổi tên sheet, tên cột hoặc thứ tự cột. Chỉ điền dữ liệu trong sheet DuLieu.</p>
                <p>Mã được hệ thống tự sinh; tên ở các cột liên kết phải tồn tại trong hệ thống.</p>
              </div>
            </div>
            <Button
              className="border-orange-200 bg-white font-bold text-orange-700 shadow-sm hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
              disabled={busy}
              onClick={handleTemplateDownload}
              type="button"
              variant="outline"
            >
              <Download className="size-4" />
              Tải file mẫu chuẩn
            </Button>
          </div>

          <input
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={busy} type="button" variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              className="bg-orange-500 font-bold hover:bg-orange-600"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <Upload className="size-4" />
              {busy ? "Đang xử lý..." : "Chọn file để nhập"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExcelActions;
