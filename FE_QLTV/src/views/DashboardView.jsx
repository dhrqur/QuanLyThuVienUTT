import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookCopy,
  BookOpen,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  FileText,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router";
import { toast } from "sonner";

import StatusBadge from "@/components/common/StatusBadge";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { api, getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/utils/dateUtils";
import { exportDashboardExcel, printDashboardPdf } from "@/utils/dashboardExport";
import { formatCurrency, getOverdueDays, getTodayValue } from "@/views/muontra/muonTraUtils";

const STAT_STYLES = [
  { icon: BookOpen, iconClass: "bg-blue-50 text-blue-600", label: "Đầu sách", valueKey: "TongSach" },
  {
    icon: ClipboardCheck,
    iconClass: "bg-violet-50 text-violet-600",
    label: "Phiếu mượn",
    valueKey: "TongPhieuMuon",
  },
  { icon: Users, iconClass: "bg-emerald-50 text-emerald-600", label: "Độc giả", valueKey: "TongDocGia" },
  {
    icon: BookCopy,
    iconClass: "bg-amber-50 text-amber-600",
    label: "Tổng số bản sách",
    valueKey: "TongSoLuongSach",
  },
  {
    icon: CircleDollarSign,
    iconClass: "bg-rose-50 text-rose-600",
    label: "Tổng tiền phạt",
    valueKey: "TongTienPhatDaThu",
    valueFormatter: formatCurrency,
  },
];

const PERIODS = [
  { value: "week", label: "7 ngày gần đây", days: 7 },
  { value: "month", label: "30 ngày gần đây", days: 30 },
  { value: "quarter", label: "3 tháng gần đây", days: 90 },
];

function DashboardView() {
  const [dashboard, setDashboard] = useState({
    loanTickets: [],
    overview: {},
    overdueTickets: [],
    topBorrowedBooks: [],
    topReaders: [],
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [dateFrom, setDateFrom] = useState(getDateDaysAgo(29));
  const [dateTo, setDateTo] = useState(getTodayValue());

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [overviewResponse, loanStatsResponse, loansResponse] = await Promise.all([
          api.getOverviewStatistics(),
          api.getStatistics("muontra"),
          api.getAll("muontra"),
        ]);
        if (!active) return;

        const loans = loansResponse.data ?? [];
        setDashboard({
          loanTickets: loans,
          overview: overviewResponse.data?.tongQuan ?? {},
          topReaders: loanStatsResponse.data?.theoDocGia ?? [],
          topBorrowedBooks: loanStatsResponse.data?.sachMuonNhieu ?? [],
          overdueTickets: loans.filter(isOverdueTicket),
        });
      } catch (error) {
        if (!active) return;
        toast.error("Không thể tải dữ liệu thống kê", {
          description: getApiErrorMessage(error),
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const { loanTickets, overview, overdueTickets, topBorrowedBooks, topReaders } = dashboard;
  const timeline = buildTimeline(loanTickets, dateFrom, dateTo);
  const reportData = {
    overview,
    overdueTickets: overdueTickets.map((ticket) => ({
      ...ticket,
      overdueDays: getOverdueDays(ticket.HanTra, getTodayValue()),
    })),
    timeline,
    title: `Khoảng thống kê: ${formatDisplayDate(dateFrom)} - ${formatDisplayDate(dateTo)}`,
    topBooks: topBorrowedBooks.slice(0, 5),
    topReaders: topReaders.slice(0, 5),
  };

  const handlePeriodChange = (nextPeriod) => {
    const days = PERIODS.find((item) => item.value === nextPeriod)?.days ?? 30;
    setPeriod(nextPeriod);
    setDateTo(getTodayValue());
    setDateFrom(getDateDaysAgo(days - 1));
  };

  return (
    <MainLayout>
      <div className="dashboard-page mx-auto flex max-w-[1600px] flex-col gap-4">
        <DashboardHeader dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={setDateFrom} onDateToChange={setDateTo} onExportExcel={() => exportDashboardExcel(reportData)} onExportPdf={() => printDashboardPdf(reportData)} onPeriodChange={handlePeriodChange} overdueCount={overdueTickets.length} period={period} />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="grid shrink-0 gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
              {STAT_STYLES.map((stat) => (
                <StatCard key={stat.valueKey} {...stat} value={overview[stat.valueKey] ?? 0} />
              ))}
            </section>

            <TrendChart dateFrom={dateFrom} dateTo={dateTo} timeline={timeline} />

            <section className="grid min-h-0 flex-1 gap-2.5 xl:grid-cols-2">
              <OverdueCasesTable tickets={overdueTickets} totalTickets={loanTickets.length} />
              <div className="grid min-h-0 gap-2.5 xl:grid-rows-2">
                <ReaderRankingTable readers={topReaders} />
                <BookRankingTable books={topBorrowedBooks} />
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function DashboardHeader({ dateFrom, dateTo, onDateFromChange, onDateToChange, onExportExcel, onExportPdf, onPeriodChange, overdueCount, period }) {
  const exportPdf = () => {
    if (!onExportPdf()) toast.error("Trình duyệt đã chặn cửa sổ in PDF. Hãy cho phép cửa sổ bật lên và thử lại.");
  };

  return (
    <section className="relative min-h-[90px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-6 py-3.5 text-white shadow-lg shadow-orange-500/10">
      <div className="absolute -right-8 -top-24 size-64 rounded-full border-[34px] border-white/5" />
      <div className="absolute -bottom-28 right-56 size-56 rounded-full border-[30px] border-white/5" />
      <div className="relative flex min-h-[90px] flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/15">
            <CalendarClock className="size-3.5" />
            Tổng quan hệ thống
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight md:text-[26px]">Thống kê và báo cáo</h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <select className="h-8 rounded-lg bg-white/15 px-2 text-xs font-bold ring-1 ring-white/20" onChange={(event) => onPeriodChange(event.target.value)} value={period}>
            {PERIODS.map((item) => <option className="text-slate-900" key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <Input aria-label="Từ ngày" className="h-8 w-32 border-white/20 bg-white/15 text-xs text-white [color-scheme:dark]" max={dateTo} onChange={(event) => onDateFromChange(event.target.value)} type="date" value={dateFrom} />
          <Input aria-label="Đến ngày" className="h-8 w-32 border-white/20 bg-white/15 text-xs text-white [color-scheme:dark]" min={dateFrom} onChange={(event) => onDateToChange(event.target.value)} type="date" value={dateTo} />
          <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/15 px-2.5 text-xs font-bold ring-1 ring-white/20 hover:bg-white/25" onClick={onExportExcel} type="button"><Download className="size-3.5" /> Excel</button>
          <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/15 px-2.5 text-xs font-bold ring-1 ring-white/20 hover:bg-white/25" onClick={exportPdf} type="button"><FileText className="size-3.5" /> PDF</button>
        </div>
        <Link
          className="hidden items-center gap-3 rounded-2xl bg-white/15 p-2.5 pr-4 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20 sm:flex"
          to="/muon-tra"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-orange-500">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-orange-100">Cần xử lý</p>
            <p className="text-base font-black">{overdueCount} phiếu quá hạn</p>
          </div>
          <ArrowRight className="ml-2 size-4 text-orange-100" />
        </Link>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, iconClass, label, value, valueFormatter }) {
  return (
    <article className="flex min-h-[72px] items-center gap-3.5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-2xl font-black leading-tight tracking-tight text-slate-900">
          {valueFormatter ? valueFormatter(value) : Number(value).toLocaleString("vi-VN")}
        </p>
        <p className="text-[10px] text-slate-400">Dữ liệu hiện tại</p>
      </div>
    </article>
  );
}

function TrendChart({ dateFrom, dateTo, timeline }) {
  return (
    <DashboardCard className="h-[280px] shrink-0">
      <CardHeading icon={CalendarClock} subtitle={`${formatDisplayDate(dateFrom)} đến ${formatDisplayDate(dateTo)}`} title="Diễn biến mượn và tiền phạt" />
      <div className="min-h-0 flex-1 px-3 pb-3">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={timeline} margin={{ left: 0, right: 8, top: 6 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} />
            <YAxis allowDecimals={false} fontSize={11} tickLine={false} width={28} yAxisId="loans" />
            <YAxis axisLine={false} fontSize={11} orientation="right" tickFormatter={(value) => `${Math.round(value / 1000)}k`} tickLine={false} width={38} yAxisId="fines" />
            <Tooltip formatter={(value, name) => [name === "Tiền phạt" ? formatCurrency(value) : value, name]} />
            <Legend />
            <Bar dataKey="loans" fill="#f97316" name="Phiếu mượn" radius={[5, 5, 0, 0]} yAxisId="loans" />
            <Bar dataKey="fines" fill="#e11d48" name="Tiền phạt" radius={[5, 5, 0, 0]} yAxisId="fines" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}

function buildTimeline(loans, dateFrom, dateTo) {
  const start = new Date(`${dateFrom}T00:00:00`);
  const end = new Date(`${dateTo}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return [];
  const days = Math.min(Math.floor((end - start) / 86_400_000) + 1, 366);
  const entries = Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, fines: 0, label: `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`, loans: 0 };
  });
  const byDate = new Map(entries.map((item) => [item.date, item]));
  loans.forEach((loan) => {
    const borrowed = byDate.get(String(loan.NgayMuon ?? "").slice(0, 10));
    if (borrowed) borrowed.loans += 1;
    const returned = byDate.get(String(loan.NgayTra ?? "").slice(0, 10));
    if (returned) returned.fines += Number(loan.TienPhat ?? 0);
  });
  const step = days > 90 ? 7 : days > 30 ? 3 : 1;
  return entries.filter((_, index) => index % step === 0 || index === entries.length - 1);
}

function getDateDaysAgo(days) {
  const date = new Date(`${getTodayValue()}T00:00:00`);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function DashboardCard({ children, className = "" }) {
  return (
    <article
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80",
        className,
      )}
    >
      {children}
    </article>
  );
}

function CardHeading({ action, icon: Icon, subtitle, title }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-extrabold text-slate-900">{title}</h2>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function ReaderRankingTable({ readers }) {
  const rows = readers.slice(0, 3);

  return (
    <DashboardCard>
      <CardHeading icon={Users} subtitle="Top 3 theo tổng số phiếu mượn" title="Độc giả mượn nhiều" />
      <SimpleTable emptyMessage="Chưa có dữ liệu độc giả mượn sách.">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <TableHead className="w-[68px]">Top</TableHead>
            <TableHead>Độc giả</TableHead>
            <TableHead className="w-[110px] text-right">Số phiếu</TableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map((reader, index) => (
            <tr className="border-t border-slate-100" key={reader.MaDG ?? index}>
              <TableCell className="font-black text-orange-600">{index + 1}</TableCell>
              <NameCell name={reader.TenDG ?? "Chưa có tên"} />
              <TableCell className="text-right font-black text-slate-900">
                {Number(reader.TongPhieuMuon ?? 0).toLocaleString("vi-VN")}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </SimpleTable>
    </DashboardCard>
  );
}

function BookRankingTable({ books }) {
  const rows = books.slice(0, 3);

  return (
    <DashboardCard>
      <CardHeading icon={BookOpen} subtitle="Top 3 theo tổng lượt mượn" title="Sách được mượn nhiều nhất" />
      <SimpleTable emptyMessage="Chưa có dữ liệu sách được mượn.">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <TableHead className="w-[68px]">Top</TableHead>
            <TableHead>Sách</TableHead>
            <TableHead className="w-[110px] text-right">Lượt mượn</TableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map((book, index) => (
            <tr className="border-t border-slate-100" key={book.MaSach ?? index}>
              <TableCell className="font-black text-orange-600">{index + 1}</TableCell>
              <NameCell name={book.TenSach ?? "Chưa có tên sách"} />
              <TableCell className="text-right font-black text-slate-900">
                {Number(book.TongLuotMuon ?? 0).toLocaleString("vi-VN")}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </SimpleTable>
    </DashboardCard>
  );
}

function OverdueCasesTable({ tickets, totalTickets }) {
  const today = getTodayValue();
  const rows = tickets.slice(0, 5);

  return (
    <DashboardCard>
      <CardHeading
        action={
          <Link
            className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
            to="/muon-tra"
          >
            Xem tất cả
          </Link>
        }
        icon={AlertTriangle}
        subtitle={`${tickets.length}/${totalTickets} phiếu đang cần xử lý`}
        title="Phiếu mượn quá hạn"
      />
      <SimpleTable emptyMessage="Không có phiếu mượn quá hạn.">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <TableHead className="w-[15%]">Mã phiếu</TableHead>
            <TableHead className="w-[31%]">Độc giả</TableHead>
            <TableHead className="w-[18%]">Hạn trả</TableHead>
            <TableHead className="w-[16%]">Trễ hạn</TableHead>
            <TableHead className="w-[20%] text-right">Trạng thái</TableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map((ticket) => (
            <tr className="border-t border-slate-100" key={ticket.MaMT}>
              <TableCell className="font-black text-slate-900">{ticket.MaMT}</TableCell>
              <NameCell name={ticket.TenDG ?? "Chưa có độc giả"} />
              <TableCell className="whitespace-nowrap">{formatDisplayDate(ticket.HanTra)}</TableCell>
              <TableCell className="whitespace-nowrap font-black text-rose-500">
                {getOverdueDays(ticket.HanTra, today)} ngày
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status="Quá hạn" />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </SimpleTable>
    </DashboardCard>
  );
}

function SimpleTable({ children, emptyMessage }) {
  const bodyRows = children?.[1]?.props?.children ?? [];
  const hasRows = Array.isArray(bodyRows) ? bodyRows.length > 0 : Boolean(bodyRows);

  return (
    <div className="min-h-0 flex-1 px-4 pb-3.5">
      {hasRows ? (
        <div className="h-full overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full table-fixed text-left text-xs">{children}</table>
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
}

function TableHead({ children, className = "" }) {
  return <th className={cn("whitespace-nowrap px-2.5 py-2 font-bold", className)}>{children}</th>;
}

function TableCell({ children, className = "" }) {
  return <td className={cn("px-2.5 py-2 text-slate-600", className)}>{children}</td>;
}

function NameCell({ name }) {
  return (
    <td className="px-2.5 py-2">
      <p className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-800">{name}</p>
    </td>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">
      <ClipboardCheck className="mb-1.5 size-7 text-emerald-500" />
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid min-h-0 flex-1 animate-pulse gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
      <div className="min-h-[78px] rounded-2xl bg-white ring-1 ring-slate-200" key={index} />
      ))}
      <div className="min-h-[360px] rounded-2xl bg-white ring-1 ring-slate-200 xl:col-span-4" />
    </div>
  );
}

function isOverdueTicket(ticket) {
  return ticket.TrangThai === "Quá hạn";
}

export default DashboardView;
