import { AlertTriangle, BookOpen, CalendarClock, CreditCard, WalletCards } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import { ErrorState, LoadingState } from "@/components/common/PageState";
import ReaderLayout from "@/components/layout/ReaderLayout";
import { errorMessage, readerApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { getLoanAlert } from "@/utils/loanStatus";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      setData(await readerApi.dashboard());
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void loadDashboard(), 0);
    return () => clearTimeout(timer);
  }, [loadDashboard]);

  return <ReaderLayout>{!data && !error ? <LoadingState /> : error ? <ErrorState message={error} retry={loadDashboard} /> : <Dashboard data={data} />}</ReaderLayout>;
}

function Dashboard({ data }) {
  const summary = data.summary;
  const cards = [
    ["Phiếu đang mượn", summary.phieuDangMuon, BookOpen, "text-brand", "bg-brand-soft"],
    ["Sắp đến hạn", summary.phieuSapDenHan, CalendarClock, "text-amber-700", "bg-amber-50"],
    ["Đang quá hạn", summary.phieuQuaHan, AlertTriangle, "text-rose-700", "bg-rose-50"],
    ["Phạt chưa thu", formatCurrency(summary.tienPhatChuaThu), WalletCards, "text-accent", "bg-accent-soft"],
  ];
  return <div className="space-y-6">
    <header><p className="text-sm font-bold text-accent">TỔNG QUAN</p><h1 className="mt-1 text-2xl font-black text-brand sm:text-3xl">Chào {data.profile.TenDG}</h1><p className="mt-1 text-sm text-slate-500">Theo dõi nhanh tình trạng sử dụng thư viện của bạn.</p></header>
    <section aria-label="Thống kê" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, color, bg]) => <article className="card flex items-center gap-4 p-5" key={label}><span className={`grid size-11 place-items-center rounded-xl ${bg} ${color}`}><Icon className="size-5" /></span><div><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-slate-800">{value}</p></div></article>)}</section>
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <section className="card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-brand">Sách đang mượn</h2><p className="text-sm text-slate-500">Các phiếu cần bạn chú ý</p></div><Link className="text-sm font-extrabold text-accent hover:underline" to="/muon-tra">Xem tất cả</Link></div><div className="mt-5 space-y-3">{data.activeLoans.length ? data.activeLoans.slice(0, 4).map((loan) => <LoanRow key={loan.MaMT} loan={loan} />) : <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">Bạn chưa mượn sách.</p>}</div></section>
      <aside className="card overflow-hidden"><div className="bg-brand p-6 text-white"><CreditCard className="size-7 text-orange-300" /><p className="mt-5 text-xs font-bold tracking-widest text-white/60">THẺ THƯ VIỆN</p><p className="mt-1 text-xl font-black">{data.libraryCard?.MaThe || "Chưa được cấp"}</p><p className="mt-5 text-sm font-bold">{data.profile.TenDG}</p><p className="text-xs text-white/60">{data.profile.MaDG}</p></div><div className="grid grid-cols-2 gap-3 p-5 text-sm"><div><p className="text-xs text-slate-500">Ngày cấp</p><p className="mt-1 font-extrabold">{formatDate(data.libraryCard?.NgayCap)}</p></div><div><p className="text-xs text-slate-500">Hết hạn</p><p className="mt-1 font-extrabold">{formatDate(data.libraryCard?.NgayHetHan)}</p></div><p className="col-span-2 mt-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-700">{data.libraryCard?.TrangThai || "Chưa có thẻ"}</p></div></aside>
    </div>
  </div>;
}

function LoanRow({ loan }) {
  const alert = getLoanAlert(loan);
  const classes = { danger: "bg-rose-50 text-rose-700", warning: "bg-amber-50 text-amber-700", normal: "bg-slate-100 text-slate-600" };
  return <article className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"><div><p className="font-black text-slate-800">Phiếu {loan.MaMT}</p><p className="mt-1 line-clamp-1 text-sm text-slate-500">{loan.ChiTiet.map((item) => item.TenSach).join(", ")}</p></div><div className="flex items-center gap-3"><span className="text-xs text-slate-500">Hạn {formatDate(loan.HanTra)}</span><span className={`rounded-full px-2.5 py-1 text-xs font-black ${classes[alert.level]}`}>{alert.text}</span></div></article>;
}
