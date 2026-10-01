import { toast } from "sonner";
import QrScannerDialog from "@/components/common/QrScanner/QrScannerDialog";
import { getLocalDateValue } from "@/utils/dateUtils";
import { parseQrIdentifier } from "@/utils/qrCode";
import { resolveScannedReader } from "@/views/muontra/loanQr";

function LoanCardScanner({ libraryCards, onSelectReader, readerOptions }) {
  function scanCard(value) {
    const cardId = parseQrIdentifier(value, "CARD");
    const readerId = resolveScannedReader(cardId, libraryCards, readerOptions, getLocalDateValue());
    onSelectReader(readerId);
    toast.success(`Đã chọn độc giả từ thẻ ${cardId}.`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:col-span-2">
      <QrScannerDialog onScan={scanCard} title="Quét thẻ độc giả" />
      <p className="text-xs text-slate-500">Quét mã trên thẻ để tự chọn độc giả.</p>
    </div>
  );
}

export default LoanCardScanner;
