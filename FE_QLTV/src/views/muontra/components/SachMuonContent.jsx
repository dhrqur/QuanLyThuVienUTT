import { useState } from "react";
import { BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import TraSachDialog from "@/views/muontra/components/TraSachDialog";

export function SachMuonDetail({ books, details: allDetails, onReturned, row }) {
  const details = allDetails;

  return (
    <section className="mt-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold">
          <BookOpen className="size-4 text-orange-500" />Danh sách sách mượn
        </h3>
        <TraSachDialog books={books} details={details} onReturned={onReturned} row={row} />
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
  const [selectedBooks, setSelectedBooks] = useState(() =>
    Object.fromEntries(existingDetails.map((detail) => [detail.MaSach, detail.SoLuong])),
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
      <div className="grid gap-3 md:grid-cols-2">
        {books.map((sach) => {
          const quantity = selectedBooks[sach.MaSach];
          const selected = Object.hasOwn(selectedBooks, sach.MaSach);
          const borrowedQuantity = Number(
            existingDetails.find((detail) => detail.MaSach === sach.MaSach)?.SoLuong || 0,
          );
          const maxQuantity = Math.max(Number(sach.SoLuong || 0) + borrowedQuantity, 1);

          return (
            <div className={`flex items-center gap-3 rounded-lg border p-3 ${selected ? "border-orange-300 bg-orange-50" : "bg-white"}`} key={sach.MaSach}>
              <input checked={selected} disabled={sach.SoLuong <= 0 && !selected} onChange={() => toggleSach(sach)} type="checkbox" />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">
                {sach.MaSach} - {sach.TenSach}
                <span className="ml-2 font-semibold text-slate-500">
                  (Còn {sach.SoLuong})
                </span>
              </span>
              {selected ? (
                <Input
                  className="h-9 w-20"
                  inputMode="numeric"
                  max={maxQuantity}
                  min="1"
                  name={`SachMuon[${sach.MaSach}]`}
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
      <p className={`text-sm font-semibold ${Object.keys(selectedBooks).length ? "text-emerald-700" : "text-rose-600"}`}>
        {Object.keys(selectedBooks).length ? `Đã chọn ${Object.keys(selectedBooks).length} đầu sách.` : "Vui lòng chọn ít nhất một sách."}
      </p>
    </fieldset>
  );
}
