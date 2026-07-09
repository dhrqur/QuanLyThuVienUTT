import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

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
import { getTodayValue } from "@/views/muontra/muonTraUtils";

function TraSachDialog({ books, details, onReturned, row }) {
  const canReturn = !row.NgayTra;
  const [open, setOpen] = useState(false);
  const [returnDate, setReturnDate] = useState(getTodayValue);

  if (!canReturn) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-emerald-200 bg-emerald-50 px-1.5 text-emerald-700" size="xs" variant="outline">
          <RotateCcw className="size-3" />
          Trả sách
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-2xl" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader className="border-b border-slate-100 px-6 py-5">
          <DialogTitle className="text-xl font-extrabold">Trả sách - {row.MaMT}</DialogTitle>
          <DialogDescription className="sr-only">
            Ghi nhận trả sách.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          <label className="block space-y-2 text-sm font-bold text-slate-700">
            <span>Ngày trả</span>
            <DatePickerInput min={row.NgayMuon} onChange={(event) => setReturnDate(event.target.value)} value={returnDate} />
          </label>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {details.map((detail) => {
              const sach = books.find((item) => item.MaSach === detail.MaSach);

              return (
                <div className="grid grid-cols-[1fr_90px] border-b border-slate-100 px-4 py-3 text-sm" key={detail.MaSach}>
                  <span>{detail.MaSach} - {sach?.TenSach}</span>
                  <span className="text-center font-bold">{detail.SoLuong}</span>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <span>Hạn trả</span>
              <strong className="text-right">{formatDisplayDate(row.HanTra)}</strong>
              <span>Ngày trả dự kiến</span>
              <strong className="text-right">{formatDisplayDate(returnDate)}</strong>
              <span className="font-extrabold md:col-span-2">
                Tiền phạt sẽ được máy chủ tính khi xác nhận trả sách.
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t bg-slate-50 px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            className="bg-emerald-600 font-bold"
            onClick={async () => {
              try {
                await onReturned({ NgayTra: returnDate });
                setOpen(false);
                toast.success("Trả sách thành công", {
                  description: `Phiếu ${row.MaMT} đã được cập nhật.`,
                });
              } catch (error) {
                toast.error("Trả sách thất bại", {
                  description: error?.response?.data?.message || error.message,
                });
              }
            }}
          >
            Xác nhận trả sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TraSachDialog;
