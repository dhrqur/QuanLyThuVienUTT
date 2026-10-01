import { useEffect, useState } from "react";
import { Download, ImageOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { downloadQrPng } from "@/utils/qrDownload";

function QrCodeCell({ entityLabel, filePrefix, identifier, qrImageUrl }) {
  const [loadingPreview, setLoadingPreview] = useState(Boolean(qrImageUrl));
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!qrImageUrl) {
      return undefined;
    }

    let active = true;
    let objectUrl = "";

    async function loadPreview() {
      setLoadingPreview(true);
      setPreviewError(false);

      try {
        const image = await api.getQrImage(qrImageUrl);
        objectUrl = URL.createObjectURL(image);

        if (active) setPreviewUrl(objectUrl);
      } catch {
        if (active) setPreviewError(true);
      } finally {
        if (active) setLoadingPreview(false);
      }
    }

    void loadPreview();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [qrImageUrl]);

  async function handleDownload() {
    setDownloading(true);

    try {
      await downloadQrPng({
        fetchQrImage: api.getQrImage,
        filePrefix,
        identifier,
        qrImageUrl,
      });
      toast.success(`Đã tải QR ${identifier}`);
    } catch (error) {
      toast.error("Không thể tải ảnh QR", { description: error.message });
    } finally {
      setDownloading(false);
    }
  }

  if (!qrImageUrl) {
    return <span className="text-xs font-medium text-slate-400">Chưa có QR</span>;
  }

  return (
    <div className="flex min-w-24 items-center justify-center gap-1.5">
      {loadingPreview ? <LoaderCircle aria-label="Đang tải mã QR" className="size-5 animate-spin text-slate-400" /> : null}
      {previewError ? <ImageOff aria-label="Không tải được mã QR" className="size-5 text-rose-500" /> : null}
      {previewUrl ? (
        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label={`Xem mã QR ${entityLabel} ${identifier} kích thước lớn`}
              className="rounded focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              type="button"
            >
              <img
                alt={`Mã QR ${entityLabel} ${identifier}`}
                className="size-12 rounded border border-slate-200 bg-white p-0.5"
                src={previewUrl}
              />
            </button>
          </DialogTrigger>
          <DialogContent className="w-auto max-w-[calc(100vw-2rem)] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mã QR {entityLabel} {identifier}</DialogTitle>
              <DialogDescription>Quét hoặc xem mã QR ở kích thước lớn.</DialogDescription>
            </DialogHeader>
            <img
              alt={`Mã QR ${entityLabel} ${identifier} kích thước lớn`}
              className="mx-auto max-h-[70dvh] w-full max-w-sm object-contain"
              src={previewUrl}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <Button
        aria-label={`Tải ảnh QR ${entityLabel} ${identifier}`}
        className="border-slate-200 bg-white px-1.5 text-slate-700 hover:bg-slate-50"
        disabled={downloading}
        onClick={handleDownload}
        size="xs"
        title={`Tải ảnh QR ${identifier}`}
        type="button"
        variant="outline"
      >
        <Download className="size-3" />
        PNG
      </Button>
    </div>
  );
}

export default QrCodeCell;
