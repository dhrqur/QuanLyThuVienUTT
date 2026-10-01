import { useCallback, useId, useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QrCameraPreview from "./QrCameraPreview";

function QrScannerDialog({ disabled = false, onScan, title }) {
  const [open, setOpen] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const inputId = useId();

  const acceptScan = useCallback((value) => {
    try {
      onScan(value);
      setOpen(false);
      setError("");
    } catch (scanError) {
      setError(scanError.message || "Không thể sử dụng mã QR này.");
    }
  }, [onScan]);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    setError("");
    setManualValue("");
    setAttempt(0);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" type="button" variant="outline"><ScanLine />{title}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-extrabold">{title}</DialogTitle>
          <DialogDescription>Quét bằng camera laptop hoặc nhập mã. Mỗi lượt quét thành công sẽ tự đóng cửa sổ.</DialogDescription>
        </DialogHeader>
        {open ? <QrCameraPreview key={attempt} onScan={acceptScan} /> : null}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700" htmlFor={inputId}>Nhập mã thủ công</label>
          <div className="flex flex-wrap gap-2">
            <Input
              aria-describedby={error ? `${inputId}-error` : undefined}
              aria-invalid={Boolean(error)}
              autoComplete="off"
              className="min-w-0 flex-1"
              id={inputId}
              maxLength={64}
              onChange={(event) => setManualValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  acceptScan(manualValue);
                }
              }}
              placeholder="Nhập mã hoặc nội dung QR"
              value={manualValue}
            />
            <Button disabled={!manualValue.trim()} onClick={() => acceptScan(manualValue)} type="button">Sử dụng mã</Button>
          </div>
          {error ? <p className="text-sm font-medium text-rose-700" id={`${inputId}-error`} role="alert">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button onClick={() => { setError(""); setAttempt((current) => current + 1); }} type="button" variant="outline">Thử lại camera</Button>
          <DialogClose asChild><Button type="button" variant="outline">Đóng</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default QrScannerDialog;
