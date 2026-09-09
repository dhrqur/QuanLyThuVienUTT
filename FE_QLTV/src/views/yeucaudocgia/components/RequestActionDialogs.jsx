import { useState } from "react";
import { Check, X } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { getLocalDateValue } from "@/utils/dateUtils";

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return getLocalDateValue(date);
}

export function ApproveBorrowDialog({ onApprove, request }) {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await onApprove({ HanTra: dueDate });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-emerald-200 bg-emerald-50 text-emerald-700" size="xs" variant="outline">
          <Check /> Duyệt mượn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt yêu cầu #{request.MaYC}</DialogTitle>
          <DialogDescription>
            Phiếu mượn chỉ được tạo sau khi hệ thống kiểm tra lại thẻ và tồn kho.
          </DialogDescription>
        </DialogHeader>
        <label className="space-y-2 text-sm font-bold text-slate-700" htmlFor={`due-${request.MaYC}`}>
          <span>Hạn trả</span>
          <DatePickerInput
            id={`due-${request.MaYC}`}
            min={getLocalDateValue()}
            onChange={(event) => setDueDate(event.target.value)}
            value={dueDate}
          />
        </label>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Đóng</Button></DialogClose>
          <Button disabled={submitting || !dueDate} onClick={submit}>
            {submitting ? "Đang duyệt..." : "Xác nhận duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectRequestDialog({ onReject, request }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await onReject({ LyDoTuChoi: reason.trim() });
      setOpen(false);
      setReason("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="destructive"><X /> Từ chối</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối yêu cầu #{request.MaYC}</DialogTitle>
          <DialogDescription>Lý do sẽ được hiển thị cho độc giả.</DialogDescription>
        </DialogHeader>
        <label className="space-y-2 text-sm font-bold text-slate-700" htmlFor={`reason-${request.MaYC}`}>
          <span>Lý do từ chối</span>
          <Input
            autoFocus
            id={`reason-${request.MaYC}`}
            maxLength={255}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ví dụ: thẻ thư viện đã hết hạn"
            value={reason}
          />
        </label>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Đóng</Button></DialogClose>
          <Button disabled={submitting || !reason.trim()} onClick={submit} variant="destructive">
            {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

