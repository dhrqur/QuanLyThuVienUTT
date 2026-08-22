import { useMemo, useState } from "react";
import { BookOpen, FileText, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { printLoanReceipt } from "@/utils/loanReceiptPdf";
import TraSachDialog from "@/views/muontra/components/TraSachDialog";

export function SachMuonDetail({ books, details: allDetails, onReturned, row, rules }) {
  const details = allDetails;
  const handlePrintReceipt = () => {
    if (!printLoanReceipt({ books, details, row })) {
      toast.error("Trình duyệt đã chặn cửa sổ in. Hãy cho phép cửa sổ bật lên và thử lại.");
    }
  };

  return (
    <section className="mt-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold">
          <BookOpen className="size-4 text-orange-500" />Danh sách sách mượn
        </h3>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrintReceipt} size="sm" type="button" variant="outline">
            <FileText /> Xuất PDF
          </Button>
          <TraSachDialog books={books} details={details} onReturned={onReturned} row={row} rules={rules} />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[110px_1fr_100px] bg-orange-50 px-4 py-2 text-xs font-extrabold text-orange-800">
          <span>Mã sách</span><span>Tên sách</span><span className="text-center">Số lượng</span>
        </div>
        {details.map((detail) => {
          const sach = books.find((item) => item.MaSach === detail.MaSach);
          return (
            <div className="grid grid-cols-[110px_1fr_100px] border-t px-4 py-3 text-sm" key={`${detail.MaMT}-${detail.MaSach}`}>
              <strong>{detail.MaSach}</strong><span>{sach?.TenSach ?? "Không tìm thấy sách"}</span>
              <strong className="text-center">{detail.SoLuong}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SachMuonSelector({ books, details, ticketId }) {
  const existingDetails = ticketId ? details : [];
  const [keyword, setKeyword] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(() =>
    Object.fromEntries(existingDetails.map((detail) => [detail.MaSach, detail.SoLuong])),
  );
  const filteredBooks = useMemo(() => {
    const normalizedKeyword = normalizeSearchText(keyword);

    return books.filter((book) => {
      if (showSelectedOnly && !Object.hasOwn(selectedBooks, book.MaSach)) return false;
      if (!normalizedKeyword) return true;

      return normalizeSearchText(`${book.MaSach} ${book.TenSach}`)
        .includes(normalizedKeyword);
    });
  }, [books, keyword, selectedBooks, showSelectedOnly]);
  const selectedEntries = Object.entries(selectedBooks);
  const selectedCopies = selectedEntries.reduce(
    (total, [, quantity]) => total + (Number(quantity) || 0),
    0,
  );

  function toggleSach(sach) {
    setSelectedBooks((current) => {
      const next = { ...current };
      if (Object.hasOwn(next, sach.MaSach)) delete next[sach.MaSach];
      else next[sach.MaSach] = 1;
      return next;
    });
  }

  function updateQuantity(sach, value) {
    if (value === "") {
      setSelectedBooks((current) => ({ ...current, [sach.MaSach]: "" }));
      return;
    }

    if (!/^\d+$/.test(value)) return;

    setSelectedBooks((current) => ({
      ...current,
      [sach.MaSach]: value,
    }));
  }

  function normalizeQuantity(sach) {
    setSelectedBooks((current) => {
      const quantity = Number(current[sach.MaSach]);
      const maxQuantity = Math.max(
        Number(sach.SoLuong || 0)
          + Number(existingDetails.find((detail) => detail.MaSach === sach.MaSach)?.SoLuong || 0),
        1,
      );

      return {
        ...current,
        [sach.MaSach]: Math.min(Math.max(quantity || 1, 1), maxQuantity),
      };
    });
  }

  return (
    <fieldset className="space-y-3 rounded-xl border bg-slate-50/60 p-4 md:col-span-3">
      <legend className="px-1 text-sm font-extrabold">Sách mượn</legend>

      {selectedEntries.map(([bookId, quantity]) => (
        <input
          key={bookId}
          name={`SachMuon[${bookId}]`}
          type="hidden"
          value={quantity}
        />
      ))}

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-10 bg-white pl-9 pr-9"
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Tìm theo mã hoặc tên sách..."
            type="search"
            value={keyword}
          />
          {keyword ? (
            <button
              aria-label="Xóa từ khóa"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setKeyword("")}
              type="button"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            className={`h-8 rounded-md px-3 text-xs font-bold transition ${
              !showSelectedOnly ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50"
            }`}
            onClick={() => setShowSelectedOnly(false)}
            type="button"
          >
            Tất cả ({books.length})
          </button>
          <button
            className={`h-8 rounded-md px-3 text-xs font-bold transition ${
              showSelectedOnly ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50"
            }`}
            onClick={() => setShowSelectedOnly(true)}
            type="button"
          >
            Đã chọn ({selectedEntries.length})
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
        <div className="grid gap-2 md:grid-cols-2">
        {filteredBooks.map((sach) => {
          const quantity = selectedBooks[sach.MaSach];
          const selected = Object.hasOwn(selectedBooks, sach.MaSach);
          const borrowedQuantity = Number(
            existingDetails.find((detail) => detail.MaSach === sach.MaSach)?.SoLuong || 0,
          );
          const maxQuantity = Math.max(Number(sach.SoLuong || 0) + borrowedQuantity, 1);

          return (
            <div className={`flex items-center gap-3 rounded-lg border p-3 ${selected ? "border-orange-300 bg-orange-50" : "border-slate-100 bg-white hover:border-slate-200"}`} key={sach.MaSach}>
              <input checked={selected} disabled={sach.SoLuong <= 0 && !selected} onChange={() => toggleSach(sach)} type="checkbox" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-800" title={sach.TenSach}>
                  {sach.TenSach}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-400">
                  {sach.MaSach} · Còn {sach.SoLuong}
                </span>
              </span>
              {selected ? (
                <Input
                  className="h-9 w-20"
                  inputMode="numeric"
                  max={maxQuantity}
                  min="1"
                  onBlur={() => normalizeQuantity(sach)}
                  onChange={(event) => updateQuantity(sach, event.target.value)}
                  type="number"
                  value={quantity}
                />
              ) : null}
            </div>
          );
        })}
        </div>
        {!filteredBooks.length ? (
          <div className="flex min-h-32 flex-col items-center justify-center px-4 text-center">
            <Search className="mb-2 size-6 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">
              {showSelectedOnly
                ? selectedEntries.length
                  ? "Không có sách đã chọn nào khớp từ khóa."
                  : "Chưa có sách nào được chọn."
                : "Không tìm thấy sách phù hợp."}
            </p>
            {keyword ? (
              <button
                className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700"
                onClick={() => setKeyword("")}
                type="button"
              >
                Xóa từ khóa tìm kiếm
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className={`text-sm font-semibold ${selectedEntries.length ? "text-emerald-700" : "text-rose-600"}`}>
        {selectedEntries.length
          ? `Đã chọn ${selectedEntries.length} đầu sách, tổng ${selectedCopies} bản.`
          : "Vui lòng chọn ít nhất một sách."}
      </p>
    </fieldset>
  );
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
}
