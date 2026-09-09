import { AlertTriangle, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingState } from "@/components/common/PageState";
import ReaderLayout from "@/components/layout/ReaderLayout";
import { errorMessage, readerApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { getLoanAlert } from "@/utils/loanStatus";

export default function LoansPage() {
  const [tab, setTab] = useState("loans");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setError("");
      const [loans, violations, requests] = await Promise.all([readerApi.loans(), readerApi.violations(), readerApi.requests({ trangThai: "CHO_DUYET", loaiYeuCau: "TRA" })]);
      setData({ loans, violations, returnRequests: requests });
    } catch (requestError) { setError(errorMessage(requestError)); }
  }, []);
  useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);

  const pendingLoanIds = useMemo(() => new Set(data?.returnRequests.map((item) => item.MaMT) || []), [data]);
  async function requestReturn(loanId) {
    try { await readerApi.createRequest({ LoaiYeuCau: "TRA", MaMT: loanId }); toast.success("Đã gửi yêu cầu trả sách"); await load(); }
    catch (requestError) { toast.error(errorMessage(requestError, "Không thể gửi yêu cầu trả sách.")); }
  }

  return <ReaderLayout><div className="space-y-6"><header><p className="text-sm font-bold text-accent">LỊCH SỬ</p><h1 className="mt-1 text-2xl font-black text-brand sm:text-3xl">Mượn trả & quá hạn</h1><p className="mt-1 text-sm text-slate-500">Theo dõi hạn trả, tiền phạt dự kiến và các vi phạm đã ghi nhận.</p></header><div className="flex gap-2 border-b border-slate-200" role="tablist"><Tab active={tab === "loans"} label="Phiếu mượn" onClick={() => setTab("loans")} /><Tab active={tab === "violations"} label="Vi phạm & tiền phạt" onClick={() => setTab("violations")} /></div>{!data && !error ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : tab === "loans" ? <LoanList loans={data.loans} pendingLoanIds={pendingLoanIds} requestReturn={requestReturn} /> : <ViolationList violations={data.violations} />}</div></ReaderLayout>;
}

function Tab({ active, label, onClick }) {
  return <button aria-selected={active} className={`min-h-11 border-b-2 px-4 text-sm font-black ${active ? "border-accent text-accent" : "border-transparent text-slate-500"}`} onClick={onClick} role="tab">{label}</button>;
}

function LoanList({ loans, pendingLoanIds, requestReturn }) {
  if (!loans.length) return <EmptyState message="Bạn chưa có lịch sử mượn sách." />;
  return <div className="space-y-4">{loans.map((loan) => <LoanCard key={loan.MaMT} loan={loan} pending={pendingLoanIds.has(loan.MaMT)} requestReturn={requestReturn} />)}</div>;
}

function LoanCard({ loan, pending, requestReturn }) {
  const alert = getLoanAlert(loan);
  const isOpen = !loan.NgayTra;
  const alertClass = { done: "bg-emerald-50 text-emerald-700", normal: "bg-brand-soft text-brand", warning: "bg-amber-50 text-amber-700", danger: "bg-rose-50 text-rose-700" }[alert.level];
  return <article className="card overflow-hidden"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-xl ${alertClass}`}>{isOpen ? <BookOpen className="size-5" /> : <CheckCircle2 className="size-5" />}</span><div><h2 className="font-black text-slate-800">Phiếu {loan.MaMT}</h2><p className="text-xs text-slate-500">Mượn {formatDate(loan.NgayMuon)} · Hạn trả {formatDate(loan.HanTra)}</p></div></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-black ${alertClass}`}>{alert.text}</span>{isOpen && <button className="button-primary flex items-center gap-2 !min-h-10 !py-1.5 text-sm" disabled={pending} onClick={() => requestReturn(loan.MaMT)}><RotateCcw className="size-4" />{pending ? "Đang chờ duyệt trả" : "Yêu cầu trả"}</button>}</div></div><div className="grid gap-5 p-5 md:grid-cols-[1fr_auto]"><ul className="space-y-2">{loan.ChiTiet.map((item) => <li className="flex justify-between gap-4 text-sm" key={item.MaSach}><span className="font-bold text-slate-700">{item.TenSach || item.MaSach}</span><span className="text-slate-500">× {item.SoLuong}</span></li>)}</ul><dl className="grid min-w-56 grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm"><div><dt className="text-xs text-slate-500">Ngày trả</dt><dd className="mt-1 font-black">{formatDate(loan.NgayTra)}</dd></div><div><dt className="text-xs text-slate-500">Tiền phạt</dt><dd className="mt-1 font-black text-rose-600">{formatCurrency(loan.TienPhat)}</dd></div>{Number(loan.DuKienPhiQuaHan) > 0 && <div className="col-span-2"><dt className="text-xs text-slate-500">Phạt quá hạn dự kiến hiện tại</dt><dd className="mt-1 font-black text-rose-600">{formatCurrency(loan.DuKienPhiQuaHan)}</dd></div>}</dl></div></article>;
}

function ViolationList({ violations }) {
  if (!violations.length) return <EmptyState message="Bạn chưa có vi phạm nào được ghi nhận." title="Không có vi phạm" />;
  return <div className="grid gap-4 lg:grid-cols-2">{violations.map((item) => <article className="card p-5" key={item.MaVP}><div className="flex justify-between gap-3"><div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><AlertTriangle className="size-5" /></span><div><h2 className="font-black text-slate-800">{item.LoaiViPham}</h2><p className="text-xs text-slate-500">{item.MaVP} · Phiếu {item.MaMT}</p></div></div><span className={`h-fit rounded-full px-2.5 py-1 text-xs font-black ${item.TrangThaiThu === "DA_THU" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.TrangThaiThu === "DA_THU" ? "Đã thu" : "Chưa thu"}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm"><div><dt className="text-xs text-slate-500">Sách</dt><dd className="font-bold text-slate-700">{item.TenSach || "—"}</dd></div><div><dt className="text-xs text-slate-500">Ngày lập</dt><dd className="font-bold text-slate-700">{formatDate(item.NgayLap)}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">Số tiền</dt><dd className="text-lg font-black text-rose-600">{formatCurrency(item.SoTien)}</dd></div></dl>{item.MoTa && <p className="mt-3 text-sm text-slate-500">{item.MoTa}</p>}</article>)}</div>;
}
