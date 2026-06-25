import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";

import DatePickerInput from "@/components/common/DatePickerInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDisplayDate } from "@/utils/dateUtils";
import {
  addYears,
  getCardStatus,
  getMinimumRenewalDate,
} from "@/views/thethuvien/theThuVienUtils";

function GiaHanTheDialog({ onRenew, row }) {
  const [open, setOpen] = useState(false);
  const [newExpirationDate, setNewExpirationDate] = useState(() => addYears(row.NgayHetHan, 1));

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (nextOpen) setNewExpirationDate(addYears(row.NgayHetHan, 1));
  }

  async function handleRenew() {
    if (!newExpirationDate) {
      toast.error("Chưa chọn ngày hết hạn mới", {
        description: "Vui lòng chọn ngày hết hạn trước khi xác nhận gia hạn.",
      });
      return;
    }

    try {
      await onRenew(newExpirationDate);
      setOpen(false);
      toast.success("Gia hạn thẻ thành công", {
        description: `Thẻ ${row.MaThe} đã được gia hạn đến ${formatDisplayDate(newExpirationDate)}.`,
      });
    } catch (error) {
      toast.error("Gia hạn thẻ thất bại", {
        description: error?.response?.data?.message || error.message,
      });
    }
  }

  return (
    <div className="mt-5 flex justify-end">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-orange-500 font-bold hover:bg-orange-600" size="sm">
            <CalendarPlus className="size-4" />
            Gia hạn thẻ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg p-0" onOpenAutoFocus={(event) => event.preventDefault()}>
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <DialogTitle className="text-xl font-extrabold text-slate-900">Gia hạn thẻ {row.MaThe}</DialogTitle>
            <DialogDescription className="sr-only">Chọn ngày hết hạn mới cho thẻ thư viện.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 px-6 py-6">
            <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <span className="font-medium text-slate-600">Ngày hết hạn hiện tại</span>
              <span className="font-bold text-slate-900">{formatDisplayDate(row.NgayHetHan)}</span>
              <span className="font-medium text-slate-600">Trạng thái hiện tại</span>
              <span className="font-bold text-slate-900">{getCardStatus(row.NgayHetHan)}</span>
            </div>
            <label className="block space-y-2 text-sm font-bold text-slate-700">
              <span>Ngày hết hạn mới</span>
              <DatePickerInput
                min={getMinimumRenewalDate(row.NgayHetHan)}
                onChange={(event) => setNewExpirationDate(event.target.value)}
                value={newExpirationDate}
              />
            </label>
          </div>
          <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <DialogClose asChild><Button type="button" variant="outline">Hủy</Button></DialogClose>
            <Button className="bg-orange-500 font-bold hover:bg-orange-600" disabled={!newExpirationDate} onClick={handleRenew}>
              Xác nhận gia hạn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GiaHanTheDialog;
