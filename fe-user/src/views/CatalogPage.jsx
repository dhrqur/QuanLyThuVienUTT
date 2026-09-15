import { BookPlus, ChevronLeft, ChevronRight, Search, ShoppingBasket, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { ErrorState, LoadingState } from "@/components/common/PageState";
import ReaderLayout from "@/components/layout/ReaderLayout";
import { useCart } from "@/contexts/cart";
import { errorMessage, readerApi } from "@/lib/api";

function createBorrowRequestPayload(items) {
  return {
    LoaiYeuCau: "MUON",
    ChiTiet: items.map(({ MaSach, SoLuong }) => ({ MaSach, SoLuong })),
  };
}

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const loadCatalog = useCallback(async () => {
    try {
      setError("");
      setCatalog(await readerApi.catalog({ keyword, page, pageSize: 12 }));
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, [keyword, page]);

  useEffect(() => {
    const timer = setTimeout(() => void loadCatalog(), 0);
    return () => clearTimeout(timer);
  }, [loadCatalog]);

  function search(event) {
    event.preventDefault();
    setPage(1);
    setKeyword(query.trim());
  }
  return <ReaderLayout><div className="space-y-6">
    <header><p className="text-sm font-bold text-accent">KHO SÁCH</p><h1 className="mt-1 text-2xl font-black text-brand sm:text-3xl">Tra cứu tài liệu</h1><p className="mt-1 text-sm text-slate-500">Tìm theo tên sách, tác giả, thể loại, nhà xuất bản hoặc vị trí kệ.</p></header>
    <form className="card flex gap-2 p-3" onSubmit={search}><label className="relative flex-1"><span className="sr-only">Từ khóa tìm kiếm</span><Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><input className="field pl-10" maxLength="100" onChange={(event) => setQuery(event.target.value)} placeholder="Nhập tên sách, tác giả..." value={query} /></label><button className="button-primary shrink-0" type="submit">Tìm kiếm</button></form>
    {!catalog && !error ? <LoadingState /> : error ? <ErrorState message={error} retry={loadCatalog} /> : <CatalogContent catalog={catalog} page={page} setPage={setPage} />}
  </div></ReaderLayout>;
}

function CatalogContent({ catalog, page, setPage }) {
  const { add, clear, items, remove, update } = useCart();
  return <div className="grid items-start gap-6 xl:grid-cols-[1fr_330px]">
    <section><p className="mb-3 text-sm font-bold text-slate-500">Tìm thấy {catalog.pagination.totalItems} đầu sách</p>{catalog.items.length ? <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{catalog.items.map((book) => <BookCard add={add} book={book} key={book.MaSach} />)}</div> : <div className="card p-12 text-center text-slate-500">Không tìm thấy sách phù hợp.</div>}<Pagination page={page} pagination={catalog.pagination} setPage={setPage} /></section>
    <BorrowCart clear={clear} items={items} remove={remove} update={update} />
  </div>;
}

function BookCard({ add, book }) {
  const available = Number(book.SoLuong) > 0;
  function addToCart() {
    add(book);
    toast.success(`Đã thêm “${book.TenSach}”`);
  }

  return <article className="card flex min-h-56 flex-col p-5"><div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-black text-brand">{book.MaSach}</span><span className={`text-xs font-black ${available ? "text-emerald-700" : "text-rose-600"}`}>{available ? `Còn ${book.SoLuong}` : "Hết sách"}</span></div><h2 className="mt-4 line-clamp-2 text-lg font-black leading-6 text-slate-800">{book.TenSach}</h2><p className="mt-2 text-sm font-semibold text-slate-500">{book.TenTG || "Chưa rõ tác giả"}</p><dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500"><div><dt>Thể loại</dt><dd className="font-bold text-slate-700">{book.TenTL || "—"}</dd></div><div><dt>Vị trí</dt><dd className="font-bold text-slate-700">{book.TenKe || "—"}</dd></div></dl><button className="button-secondary mt-auto flex items-center justify-center gap-2 pt-3" disabled={!available} onClick={addToCart}><BookPlus className="size-4" />Thêm vào yêu cầu</button></article>;
}

function BorrowCart({ clear, items, remove, update }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  async function submitBorrowRequest() {
    if (!items.length) return;
    setSubmitting(true);
    try {
      await readerApi.createRequest(createBorrowRequestPayload(items));
      clear(); toast.success("Đã gửi yêu cầu mượn sách"); navigate("/yeu-cau");
    } catch (error) { toast.error(errorMessage(error, "Không thể gửi yêu cầu mượn.")); }
    finally { setSubmitting(false); }
  }
  return <aside className="card xl:sticky xl:top-22"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 font-black text-brand"><ShoppingBasket className="size-5" />Giỏ yêu cầu</h2>{items.length > 0 && <button className="text-xs font-bold text-slate-500 hover:text-rose-600" onClick={clear}>Xóa hết</button>}</div><div className="space-y-3 p-5">{items.length ? items.map((item) => <div className="rounded-lg bg-slate-50 p-3" key={item.MaSach}><div className="flex justify-between gap-2"><div><p className="line-clamp-2 text-sm font-extrabold text-slate-700">{item.TenSach}</p><p className="text-xs text-slate-500">{item.MaSach}</p></div><button aria-label={`Xóa ${item.TenSach}`} className="grid size-9 shrink-0 place-items-center text-slate-400 hover:text-rose-600" onClick={() => remove(item.MaSach)}><Trash2 className="size-4" /></button></div><label className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">Số lượng<input aria-label={`Số lượng ${item.TenSach}`} className="field ml-auto !min-h-9 w-20 !py-1" max={item.TonKho} min="1" onChange={(event) => update(item.MaSach, event.target.value)} type="number" value={item.SoLuong} /></label></div>) : <p className="py-8 text-center text-sm text-slate-500">Chưa có sách nào được chọn.</p>}<button className="button-primary w-full" disabled={!items.length || submitting} onClick={submitBorrowRequest}>{submitting ? "Đang gửi..." : `Gửi yêu cầu (${items.length})`}</button><p className="text-center text-[11px] leading-4 text-slate-400">Sách chỉ được trừ tồn kho sau khi thủ thư duyệt.</p></div></aside>;
}

function Pagination({ page, pagination, setPage }) {
  if (pagination.totalPages <= 1) return null;
  return <nav aria-label="Phân trang" className="mt-6 flex items-center justify-center gap-3"><button aria-label="Trang trước" className="button-secondary grid !size-11 !p-0 place-items-center" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="size-5" /></button><span className="text-sm font-extrabold text-slate-600">Trang {page}/{pagination.totalPages}</span><button aria-label="Trang sau" className="button-secondary grid !size-11 !p-0 place-items-center" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}><ChevronRight className="size-5" /></button></nav>;
}
