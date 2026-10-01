import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { exportQrPngs } from "@/utils/qrDownload";

function QrExportAction({ entityLabel, filePrefix, identifierKey, rows, zipFileName }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);

    try {
      const { exportedIdentifiers, skippedIdentifiers } = await exportQrPngs({
        fetchQrImage: api.getQrImage,
        filePrefix,
        identifierKey,
        rows,
        zipFileName,
      });

      toast.success(`Đã xuất ${exportedIdentifiers.length} QR ${entityLabel}`);
      if (skippedIdentifiers.length) {
        toast.warning(`Đã bỏ qua ${skippedIdentifiers.length} QR chưa tải được.`);
      }
    } catch (error) {
      toast.error("Xuất QR thất bại", { description: error.message });
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      className="border-orange-200 bg-orange-50 font-bold text-orange-700 shadow-sm hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
      disabled={exporting || !rows.length}
      onClick={handleExport}
      type="button"
      variant="outline"
    >
      <Download className="size-4" />
      {exporting ? "Đang xuất QR..." : "Xuất tất cả QR"}
    </Button>
  );
}

export default QrExportAction;
