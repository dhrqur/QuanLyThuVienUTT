import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BookCopy, BookOpen, Boxes, CalendarDays, Download, FileText, LibraryBig, PackagePlus, Phone, ReceiptText, RotateCcw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { api, getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/utils/dateUtils";
import { formatCurrency, formatNumber, toNumber } from "@/utils/numberUtils";
import { exportDashboardExcel, printDashboardPdf } from "@/utils/dashboardExport";

const PERIODS = [
  { value: 7, label: "7 ngày" },
  { value: 30, label: "30 ngày" },
  { value: 90, label: "90 ngày" },
];

const EMPTY_DASHBOARD = {
  hoatDongTheoKy: [], hoatDongTheoNgay: [], kyThongKe: {}, phieuQuaHan: [], sachCanBoSung: [],
  sachMuonNhieu: [], thangCoDuLieu: [], tinhTrangKho: {}, tongQuan: {}, xuHuong: {},
};

function DashboardView() {
  const currentMonth = getMonthKey(new Date());
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    let active = true;
    const [year, month] = selectedMonth.split("-").map(Number);
    async function loadDashboard() {
      setLoading(true);
      try {
        const response = await api.getDashboardStatistics({ days: period, year, month });
        if (active) setDashboard({ ...EMPTY_DASHBOARD, ...(response.data ?? {}) });
      } catch (error) {
        if (!active) return;
        toast.error("Không thể tải dữ liệu dashboard", { description: getApiErrorMessage(error) });
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => { active = false; };
  }, [period, selectedMonth]);

  const { tongQuan, xuHuong, tinhTrangKho } = dashboard;
  const totalCopies = number(tongQuan.TongSoBan);
  const circulatingCopies = number(tongQuan.SoBanDangMuon);
  const overdueCopies = number(tongQuan.SoBanQuaHan);
  const rotationRate = percent(circulatingCopies, totalCopies);
  const overdueRate = percent(overdueCopies, circulatingCopies);
  const currentPeriodLabel = `${period} ngày`;

  const monthOptions = useMemo(() => {
    const values = dashboard.thangCoDuLieu.map((item) => `${item.Nam}-${String(item.Thang).padStart(2, "0")}`);
    return [...new Set([currentMonth, ...values])].sort().reverse();
  }, [currentMonth, dashboard.thangCoDuLieu]);
  const timeline = useMemo(() => buildMonthTimeline(selectedMonth, dashboard.hoatDongTheoNgay), [dashboard.hoatDongTheoNgay, selectedMonth]);
  const timelineTotals = useMemo(() => timeline.reduce((totals, item) => ({
    loans: totals.loans + item.loans,
    returns: totals.returns + item.returns,
  }), { loans: 0, returns: 0 }), [timeline]);
  const periodRange = getPeriodRange(period);
  const reportTimeline = useMemo(
    () => buildRangeTimeline(periodRange.dateFrom, periodRange.dateTo, dashboard.hoatDongTheoKy),
    [dashboard.hoatDongTheoKy, periodRange.dateFrom, periodRange.dateTo],
  );

  const kpis = [
    { icon: BookCopy, label: "Kho sách", value: totalCopies, unit: "bản", note: `${formatNumber(tongQuan.TongDauSach)} đầu sách trong danh mục`, tone: "blue" },
    { icon: RotateCcw, label: "Đang lưu thông", value: circulatingCopies, unit: "bản", note: `${formatNumber(tongQuan.PhieuChuaHoanTat)} phiếu chưa hoàn tất · Vòng quay ${formatPercent(rotationRate)}`, tone: "orange", trend: getTrend(xuHuong.MuonKyNay, xuHuong.MuonKyTruoc, currentPeriodLabel) },
    { icon: AlertTriangle, label: "Quá hạn", value: tongQuan.PhieuQuaHan, unit: "phiếu", note: `${formatNumber(overdueCopies)} bản chưa trả · ${formatPercent(overdueRate)} sách đang mượn`, tone: overdueRate >= 15 ? "red" : "amber", trend: getTrend(xuHuong.QuaHanKyNay, xuHuong.QuaHanKyTruoc, currentPeriodLabel) },
    { icon: PackagePlus, label: "Cần bổ sung", value: tongQuan.DauSachCanBoSung, unit: "đầu sách", note: `${formatNumber(tinhTrangKho.HetSach)} hết sách · ${formatNumber(tinhTrangKho.SapHet)} sắp hết`, tone: "violet" },
  ];

  const reportData = {
    overview: {
      TongSach: tongQuan.TongDauSach,
      TongSoLuongSach: totalCopies,
      SoBanDangMuon: circulatingCopies,
      PhieuQuaHan: tongQuan.PhieuQuaHan,
      DauSachCanBoSung: tongQuan.DauSachCanBoSung,
      BanMuonTrongKy: xuHuong.MuonKyNay,
      BanMuonKyTruoc: xuHuong.MuonKyTruoc,
      PhieuQuaHanTrongKy: xuHuong.QuaHanKyNay,
      TongTienPhatDaThu: tongQuan.TongTienPhatDaThu,
      SoViPhamChuaThu: tongQuan.SoViPhamChuaThu,
      TienPhatChuaThu: tongQuan.TienPhatChuaThu,
      TienPhatTrongKy: xuHuong.TienPhatKyNay,
      TienPhatKyTruoc: xuHuong.TienPhatKyTruoc,
    },
    overdueTickets: dashboard.phieuQuaHan.map((item) => ({ ...item, overdueDays: item.SoNgayQuaHan })),
    timeline: reportTimeline,
    title: `Kỳ KPI ${formatDisplayDate(periodRange.dateFrom)} – ${formatDisplayDate(periodRange.dateTo)}`,
    activityTitle: `Hoạt động mượn – trả trong ${currentPeriodLabel}`,
    topBooks: dashboard.sachMuonNhieu,
    attentionBooks: dashboard.sachCanBoSung,
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-white pb-8">
        <div className="flex flex-col gap-4">
          <DashboardHeader onExportExcel={() => exportDashboardExcel(reportData)} onExportPdf={() => printDashboardPdf(reportData)} onPeriodChange={setPeriod} period={period} />
          {loading ? <DashboardSkeleton /> : (
            <>
              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</section>
              <FineCollectionSummary current={xuHuong.TienPhatKyNay} outstandingAmount={tongQuan.TienPhatChuaThu} outstandingCount={tongQuan.SoViPhamChuaThu} period={period} previous={xuHuong.TienPhatKyTruoc} total={tongQuan.TongTienPhatDaThu} />
              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.75fr)]">
                <CirculationChart monthOptions={monthOptions} onMonthChange={setSelectedMonth} selectedMonth={selectedMonth} timeline={timeline} totals={timelineTotals} />
                <InventoryDonut stock={tinhTrangKho} total={tongQuan.TongDauSach} />
              </section>
              <section className="grid gap-4 xl:grid-cols-2">
                <PopularBooks books={dashboard.sachMuonNhieu} />
                <AttentionBooks books={dashboard.sachCanBoSung} total={tongQuan.DauSachCanBoSung} />
              </section>
              <OverdueTable loans={dashboard.phieuQuaHan} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function DashboardHeader({ onExportExcel, onExportPdf, onPeriodChange, period }) {
  const handleExcel = async () => {
    try {
      await onExportExcel();
      toast.success("Đã xuất báo cáo Excel kèm biểu đồ.");
    } catch (error) {
      toast.error("Không thể tạo file Excel", { description: error?.message });
    }
  };
  const handlePrint = () => {
    if (!onExportPdf()) toast.error("Trình duyệt đã chặn cửa sổ in. Hãy cho phép cửa sổ bật lên và thử lại.");
  };
  return (
    <header className="flex flex-col gap-4 pb-2 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F1663D]">Thư viện UTT</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#25245A] md:text-[28px]">Tổng quan vận hành</h1>
        <p className="mt-1 text-sm text-[#59617F]">{formatLongDate(new Date())} · KPI hiện tại, xu hướng theo kỳ đã chọn</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          {PERIODS.map((item) => (
            <button className={cn("h-8 rounded-lg px-3 text-xs font-bold transition", period === item.value ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")} key={item.value} onClick={() => onPeriodChange(item.value)} type="button">{item.label}</button>
          ))}
        </div>
        <button aria-label="Xuất Excel" className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:text-[#F1663D]" onClick={handleExcel} title="Xuất Excel (.xlsx)" type="button"><Download className="size-4" /></button>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#F1663D] px-3.5 text-xs font-bold text-white transition hover:bg-[#dc5732]" onClick={handlePrint} type="button"><FileText className="size-4" />Xuất báo cáo</button>
      </div>
    </header>
  );
}

const TONES = {
  amber: { accent: "bg-amber-500", icon: "bg-amber-50 text-amber-600" },
  blue: { accent: "bg-[#25245A]", icon: "bg-indigo-50 text-[#25245A]" },
  orange: { accent: "bg-[#F1663D]", icon: "bg-orange-50 text-[#F1663D]" },
  red: { accent: "bg-rose-500", icon: "bg-rose-50 text-rose-600" },
  violet: { accent: "bg-violet-500", icon: "bg-violet-50 text-violet-600" },
};

function KpiCard({ icon: Icon, label, note, tone, trend, unit, value }) {
  const style = TONES[tone] ?? TONES.blue;
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
      <span className={cn("absolute inset-x-0 top-0 h-1", style.accent)} />
      <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-[#46506E]">{label}</p><span className={cn("flex size-9 items-center justify-center rounded-xl", style.icon)}><Icon className="size-[18px]" /></span></div>
      <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
        <p className="text-[32px] font-black leading-none tracking-tight text-[#25245A]">{formatNumber(value)}</p>
        <span className="pb-0.5 text-xs font-bold text-[#7A83A1]">{unit}</span>
        {trend && <TrendBadge {...trend} />}
      </div>
      <p className="mt-2 min-h-4 text-xs font-medium leading-relaxed text-[#68718F]">{note}</p>
    </article>
  );
}

function TrendBadge({ direction, label, title }) {
  const up = direction === "up";
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return <span className={cn("mb-0.5 ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-extrabold", up ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")} title={title}><Icon className="size-3" />{label}</span>;
}

function FineCollectionSummary({ current, outstandingAmount, outstandingCount, period, previous, total }) {
  const currentValue = number(current);
  const previousValue = number(previous);
  const change = previousValue
    ? Math.round(Math.abs((currentValue - previousValue) / previousValue) * 100)
    : currentValue > 0 ? 100 : 0;
  const improved = currentValue >= previousValue;

  return (
    <DashboardCard>
      <div className="grid md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-stretch">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 md:border-b-0 md:border-r md:px-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><ReceiptText className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Cần thu</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2"><strong className="text-xl font-black text-rose-600">{formatCurrency(outstandingAmount)}</strong><span className="text-xs font-semibold text-slate-500">{formatNumber(outstandingCount)} vi phạm</span></div>
          </div>
        </div>
        <FineMetric label={`Đã thu trong ${period} ngày`} value={formatCurrency(currentValue)}>
          {change > 0 && <span className={cn("text-[10px] font-bold", improved ? "text-emerald-600" : "text-amber-600")}>{improved ? "+" : "−"}{change}% so với kỳ trước</span>}
        </FineMetric>
        <FineMetric label="Tổng đã thu" value={formatCurrency(total)}><span className="text-[10px] font-medium text-slate-400">Lũy kế toàn bộ dữ liệu</span></FineMetric>
        <div className="flex items-center border-t border-slate-100 px-4 py-3 md:border-l md:border-t-0 md:px-5"><InlineLink label="Mở xử lý vi phạm" to="/xu-ly-vi-pham" /></div>
      </div>
    </DashboardCard>
  );
}

function FineMetric({ children, label, value }) {
  return <div className="border-b border-slate-100 px-4 py-3 md:border-b-0 md:px-5"><p className="text-xs font-semibold text-slate-500">{label}</p><strong className="mt-1 block text-lg font-black text-[#25245A]">{value}</strong>{children}</div>;
}

function CirculationChart({ monthOptions, onMonthChange, selectedMonth, timeline, totals }) {
  const monthLabel = formatMonth(selectedMonth);
  return (
    <DashboardCard className="min-h-[390px]">
      <CardHeader action={(
        <label className="relative"><span className="sr-only">Chọn tháng thống kê</span>
          <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100" onChange={(event) => onMonthChange(event.target.value)} value={selectedMonth}>
            {monthOptions.map((value) => <option key={value} value={value}>{formatMonth(value)}</option>)}
          </select><CalendarDays className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-slate-400" />
        </label>
      )} icon={BookOpen} subtitle="Số lượt phát sinh theo từng ngày" title="Hoạt động mượn – trả" />
      <div className="h-[255px] px-1 pr-4">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={timeline} barCategoryGap="20%" margin={{ left: -20, right: 4, top: 12 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis axisLine={false} dataKey="label" fontSize={10} interval="preserveStartEnd" tickLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} axisLine={false} fontSize={10} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="loans" fill="#F1663D" maxBarSize={18} name="Mượn" radius={[5, 5, 0, 0]} />
            <Bar dataKey="returns" fill="#10b981" maxBarSize={18} name="Trả" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 font-semibold text-slate-600"><LegendDot color="bg-[#F1663D]" label="Mượn" /><LegendDot color="bg-emerald-500" label="Trả" /></div>
        <p className="font-medium text-slate-500">Tổng: <strong className="text-slate-900">{formatNumber(totals.loans)} lượt mượn</strong>{" · "}<strong className="text-slate-900">{formatNumber(totals.returns)} lượt trả</strong> trong {monthLabel.toLowerCase()}</p>
      </div>
    </DashboardCard>
  );
}

function ChartTooltip({ active, label, payload }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm"><p className="mb-1.5 font-extrabold text-slate-900">Ngày {label}</p>{payload.map((item) => <p className="mt-1 font-semibold" key={item.dataKey} style={{ color: item.color }}>{item.name}: {formatNumber(item.value)} lượt</p>)}</div>;
}

function InventoryDonut({ stock, total }) {
  const data = [
    { color: "#10b981", label: "Ổn định", value: number(stock.OnDinh) },
    { color: "#f59e0b", label: "Sắp hết", value: number(stock.SapHet) },
    { color: "#ef4444", label: "Hết sách", value: number(stock.HetSach) },
  ];
  return (
    <DashboardCard className="min-h-[390px]">
      <CardHeader icon={Boxes} subtitle="Theo số bản hiện còn trong kho" title="Tình trạng kho" />
      <div className="relative mx-auto h-[210px] w-full max-w-[270px]">
        <ResponsiveContainer height="100%" width="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={68} outerRadius={91} paddingAngle={2} stroke="none">{data.map((item) => <Cell fill={item.color} key={item.label} />)}</Pie><Tooltip formatter={(value) => [`${formatNumber(value)} đầu sách`, "Số lượng"]} /></PieChart></ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-3xl font-black text-slate-950">{formatNumber(total)}</strong><span className="mt-1 text-xs font-semibold text-slate-400">đầu sách</span></div>
      </div>
      <div className="grid gap-2 px-5 pb-5">{data.map((item) => <div className="flex items-center rounded-lg bg-slate-50 px-3 py-2" key={item.label}><span className="mr-2.5 size-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="flex-1 text-xs font-semibold text-slate-600">{item.label}</span><strong className="text-sm text-slate-950">{formatNumber(item.value)}</strong></div>)}</div>
    </DashboardCard>
  );
}

function PopularBooks({ books }) {
  const maximum = Math.max(...books.map((book) => number(book.TongLuotMuon)), 1);
  return (
    <DashboardCard className="min-h-[350px]">
      <CardHeader icon={LibraryBig} subtitle="Xếp hạng theo tổng số bản đã mượn" title="Sách được mượn nhiều nhất" />
      <div className="space-y-4 px-5 pb-5">{books.length ? books.map((book, index) => (
        <div className="flex items-center gap-3" key={book.MaSach}>
          <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black", index < 3 ? "bg-orange-50 text-[#F1663D]" : "bg-slate-100 text-slate-500")}>{index + 1}</span>
          <div className="min-w-0 flex-1"><div className="mb-1.5 flex items-center gap-3"><p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800" title={book.TenSach}>{book.TenSach}</p><span className="shrink-0 text-xs font-bold text-slate-500">{formatNumber(book.TongLuotMuon)} lượt</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#F1663D]" style={{ width: `${number(book.TongLuotMuon) / maximum * 100}%` }} /></div></div>
        </div>
      )) : <EmptyState message="Chưa có dữ liệu lượt mượn sách." />}</div>
    </DashboardCard>
  );
}

function AttentionBooks({ books, total }) {
  return (
    <DashboardCard className="min-h-[350px]">
      <CardHeader action={<InlineLink label="Mở quản lý sách" to="/sach" />} icon={PackagePlus} subtitle={`${formatNumber(total)} đầu sách cần ưu tiên kiểm kê và bổ sung`} title="Sách cần kiểm tra & bổ sung" />
      <div className="min-h-0 flex-1 px-5 pb-5">{books.length ? <div className="divide-y divide-slate-100">{books.map((book) => (
        <div className="flex items-center gap-3 py-2.5" key={book.MaSach}><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800" title={book.TenSach}>{book.TenSach}</p><p className="mt-0.5 text-[11px] font-medium text-slate-400">{book.MaSach} · Còn {formatNumber(book.SoLuong)} bản</p></div><StockBadge status={book.TrangThai} /></div>
      ))}</div> : <EmptyState message="Kho sách đang ở trạng thái ổn định." />}</div>
    </DashboardCard>
  );
}

function StockBadge({ status }) {
  const empty = status === "Hết sách";
  return <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold", empty ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-700")}>{status}</span>;
}

function OverdueTable({ loans }) {
  return (
    <DashboardCard className="min-h-[320px]">
      <CardHeader action={<InlineLink label="Mở quản lý mượn trả" to="/muon-tra" />} icon={AlertTriangle} subtitle={loans.length ? `${loans.length} phiếu cần ưu tiên liên hệ` : "Không có phiếu cần xử lý"} title="Phiếu quá hạn ưu tiên" />
      <div className="min-h-0 flex-1 px-4 pb-4 md:px-5">{loans.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[1050px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500"><tr><TableHead>Độc giả</TableHead><TableHead>Mã phiếu</TableHead><TableHead>Ngày mượn</TableHead><TableHead>Hạn trả</TableHead><TableHead className="text-center">Số sách</TableHead><TableHead>Số ngày quá hạn</TableHead><TableHead>Mức độ</TableHead><TableHead className="text-right">Hành động</TableHead></tr></thead>
          <tbody>{loans.map((loan) => (
            <tr className="border-t border-slate-100 transition hover:bg-slate-50/70" key={loan.MaMT}>
              <TableCell><div className="flex items-center gap-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[10px] font-black text-[#F1663D]">{getInitials(loan.TenDG)}</span><div className="min-w-0"><p className="max-w-[180px] truncate font-bold text-slate-800" title={loan.TenDG}>{loan.TenDG ?? loan.MaDG}</p><p className="mt-0.5 text-[10px] text-slate-400">{loan.MaDG}</p></div></div></TableCell>
              <TableCell className="font-black text-slate-950">{loan.MaMT}</TableCell><TableCell>{formatDisplayDate(loan.NgayMuon)}</TableCell><TableCell>{formatDisplayDate(loan.HanTra)}</TableCell><TableCell className="text-center font-bold text-slate-800">{formatNumber(loan.TongSoLuong)}</TableCell><TableCell className="font-black text-rose-600">{formatNumber(loan.SoNgayQuaHan)} ngày</TableCell><TableCell><SeverityBadge days={number(loan.SoNgayQuaHan)} /></TableCell>
              <TableCell className="text-right"><a className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:border-orange-200 hover:text-[#F1663D]" href={loan.Sdt ? `tel:${loan.Sdt}` : `mailto:${loan.Email}`} title={loan.Sdt || loan.Email || "Chưa có thông tin liên hệ"}><Phone className="size-3.5" />Liên hệ</a></TableCell>
            </tr>
          ))}</tbody>
        </table></div>
      ) : <EmptyState message="Tất cả phiếu mượn đều đang trong hạn." />}</div>
    </DashboardCard>
  );
}

function SeverityBadge({ days }) {
  const style = days > 90 ? "bg-rose-50 text-rose-700" : days > 30 ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";
  const label = days > 90 ? "Nghiêm trọng" : days > 30 ? "Quá hạn lâu" : "Quá hạn";
  return <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-extrabold", style)}>{label}</span>;
}

function DashboardCard({ children, className = "" }) {
  return <article className={cn("flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white", className)}>{children}</article>;
}

function CardHeader({ action, icon: Icon, subtitle, title }) {
  return <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-3 pt-4 md:px-5 md:pt-5"><div className="flex min-w-0 items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#F1663D]"><Icon className="size-[18px]" /></span><div className="min-w-0"><h2 className="truncate text-base font-extrabold text-[#25245A]">{title}</h2><p className="mt-0.5 truncate text-xs text-[#7A83A1]">{subtitle}</p></div></div>{action}</div>;
}

function InlineLink({ label, to }) {
  return <Link className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#F1663D] transition hover:text-[#dc5732]" to={to}>{label}<ArrowRight className="size-3.5" /></Link>;
}

function LegendDot({ color, label }) { return <span className="inline-flex items-center gap-2"><span className={cn("size-2.5 rounded-full", color)} />{label}</span>; }
function TableHead({ children, className = "" }) { return <th className={cn("whitespace-nowrap px-3 py-2.5 font-bold", className)}>{children}</th>; }
function TableCell({ children, className = "" }) { return <td className={cn("whitespace-nowrap px-3 py-2.5 text-slate-600", className)}>{children}</td>; }

function EmptyState({ message }) {
  return <div className="flex h-full min-h-36 flex-col items-center justify-center px-4 text-center"><LibraryBig className="mb-2 size-8 text-emerald-500" /><p className="text-sm font-semibold text-slate-500">{message}</p></div>;
}

function DashboardSkeleton() {
  return <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div className="h-32 rounded-2xl bg-white ring-1 ring-slate-200" key={index} />)}<div className="h-[390px] rounded-2xl bg-white ring-1 ring-slate-200 sm:col-span-2 xl:col-span-3" /><div className="h-[390px] rounded-2xl bg-white ring-1 ring-slate-200 sm:col-span-2 xl:col-span-1" /></div>;
}

function buildMonthTimeline(monthKey, rows) {
  const [year, month] = monthKey.split("-").map(Number);
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const days = isCurrentMonth ? now.getDate() : new Date(year, month, 0).getDate();
  const byDate = new Map(rows.map((item) => [String(item.Ngay).slice(0, 10), item]));
  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const activity = byDate.get(date) ?? {};
    return { date, label: String(day).padStart(2, "0"), loans: number(activity.SoLuotMuon), returns: number(activity.SoLuotTra) };
  });
}

function buildRangeTimeline(dateFrom, dateTo, rows) {
  const start = new Date(`${dateFrom}T00:00:00`);
  const end = new Date(`${dateTo}T00:00:00`);
  const byDate = new Map(rows.map((item) => [String(item.Ngay).slice(0, 10), item]));
  const days = Math.round((end - start) / 86_400_000) + 1;
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    const activity = byDate.get(key) ?? {};
    return { date: key, label: formatDisplayDate(key), loans: number(activity.SoLuotMuon), returns: number(activity.SoLuotTra) };
  });
}

function getTrend(currentValue, previousValue, periodLabel) {
  const current = number(currentValue); const previous = number(previousValue);
  if (current === previous) return null;
  const change = previous ? Math.round(Math.abs((current - previous) / previous) * 100) : 100;
  return { direction: current > previous ? "up" : "down", label: `${change}%`, title: `So với ${periodLabel} liền trước` };
}

function getInitials(name) { const words = String(name ?? "DG").trim().split(/\s+/); return words.slice(-2).map((word) => word.charAt(0).toUpperCase()).join(""); }
function getMonthKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function getPeriodRange(days) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return { dateFrom: toDateKey(start), dateTo: toDateKey(end) };
}
function toDateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function formatMonth(value) { const [year, month] = value.split("-"); return `Tháng ${Number(month)}/${year}`; }
function formatLongDate(date) { return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date); }
const number = toNumber;
function percent(value, total) { return total ? value / total * 100 : 0; }
function formatPercent(value) { return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(number(value))}%`; }

export default DashboardView;
