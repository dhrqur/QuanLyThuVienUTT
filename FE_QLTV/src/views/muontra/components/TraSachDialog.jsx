import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import DatePickerInput from "@/components/common/DatePickerInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatDisplayDate, getLocalDateValue } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/numberUtils";
import { getOverdueDays } from "@/views/muontra/muonTraUtils";

function TraSachDialog({ books, details, onReturned, row, rules }) {
  const canReturn = !row.NgayTra;
  const [open, setOpen] = useState(false);
  const [returnDate, setReturnDate] = useState(getLocalDateValue);
  const [conditions, setConditions] = useState({});

  function updateCondition(bookId, key, value) {
    setConditions((current) => ({
      ...current,
      [bookId]: {
        ...current[bookId],
        [key]: value,
      },
    }));
  }

  if (!canReturn) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-emerald-200 bg-emerald-50 px-1.5 text-emerald-700" size="xs" variant="outline">
          <RotateCcw className="size-3" />
          Trả sách
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-3xl" onOpenAutoFocus={(event) => event.preventDefault()}>
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

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <div className="grid min-w-[650px] grid-cols-[1fr_80px_100px_100px_140px] bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-600">
              <span>Sách</span><span className="text-center">Đã mượn</span><span>Hư hỏng</span><span>Làm mất</span><span className="text-right">Phí phát sinh</span>
            </div>
            {details.map((detail) => {
              const sach = books.find((item) => item.MaSach === detail.MaSach);
              const condition = conditions[detail.MaSach] ?? {};

              return (
                <div className="grid min-w-[650px] grid-cols-[1fr_80px_100px_100px_140px] items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm" key={detail.MaSach}>
                  <span className="truncate" title={sach?.TenSach}>{detail.MaSach} - {sach?.TenSach}</span>
                  <span className="text-center font-bold">{detail.SoLuong}</span>
                  <ReturnInput max={Math.max(Number(detail.SoLuong) - Number(condition.SoLuongMat || 0), 0)} onChange={(value) => updateCondition(detail.MaSach, "SoLuongHong", value)} value={condition.SoLuongHong ?? ""} />
                  <ReturnInput max={Math.max(Number(detail.SoLuong) - Number(condition.SoLuongHong || 0), 0)} onChange={(value) => updateCondition(detail.MaSach, "SoLuongMat", value)} value={condition.SoLuongMat ?? ""} />
                  <strong className="text-right text-rose-600">{formatCurrency(getBookFine(condition, rules))}</strong>
                </div>
              );
            })}
          </div>

          <label className="block space-y-2 text-sm font-bold text-slate-700">
            <span>Ghi chú tình trạng sách</span>
            <Input onChange={(event) => setConditions((current) => ({ ...current, _note: event.target.value }))} placeholder="Ví dụ: rách bìa, mất trang..." value={conditions._note ?? ""} />
          </label>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <span>Hạn trả</span>
              <strong className="text-right">{formatDisplayDate(row.HanTra)}</strong>
              <span>Ngày trả dự kiến</span>
              <strong className="text-right">{formatDisplayDate(returnDate)}</strong>
              <span className="font-extrabold md:col-span-2">
                Quá hạn dự kiến: {formatCurrency(getOverdueDays(row.HanTra, returnDate) * Number(rules.PhiQuaHanMoiNgay))} · Hỏng/mất: {formatCurrency(getConditionFine(conditions, rules))}
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
                const invalid = details.find((detail) => {
                  const condition = conditions[detail.MaSach] ?? {};
                  return Number(condition.SoLuongHong || 0) + Number(condition.SoLuongMat || 0) > Number(detail.SoLuong);
                });
                if (invalid) throw new Error(`Tổng số sách hỏng và mất của ${invalid.MaSach} vượt quá số đã mượn.`);
                await onReturned({
                  NgayTra: returnDate,
                  ChiTietTra: details.map((detail) => ({
                    MaSach: detail.MaSach,
                    SoLuongHong: Number(conditions[detail.MaSach]?.SoLuongHong || 0),
                    SoLuongMat: Number(conditions[detail.MaSach]?.SoLuongMat || 0),
                    MoTa: conditions._note || "",
                  })),
                });
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

function ReturnInput({ max, onChange, value }) {
  return <Input className="h-9 text-center font-bold" max={max} min="0" onChange={(event) => onChange(event.target.value === "" ? "" : Math.max(0, Math.min(Number(event.target.value), Number(max))))} placeholder="0" type="number" value={value} />;
}

function getBookFine(condition, rules) {
  return Number(condition.SoLuongHong || 0) * Number(rules.PhiHuHongMoiBan) + Number(condition.SoLuongMat || 0) * Number(rules.PhiLamMatMoiBan);
}

function getConditionFine(conditions, rules) {
  return Object.entries(conditions).reduce((total, [key, item]) => key === "_note" ? total : total + getBookFine(item, rules), 0);
}

export default TraSachDialog;
