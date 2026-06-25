import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BookCopy,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import StatusBadge from "@/components/common/StatusBadge";
import MainLayout from "@/components/layout/MainLayout";
import { api, getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/utils/dateUtils";
import {
  formatCurrency,
  getMuonTraStatus,
  getOverdueDays,
  getTodayValue,
} from "@/views/muontra/muonTraUtils";

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
];

const STATUS_CHART_COLORS = {
  "Đang mượn": "#f59e0b",
  "Quá hạn": "#f43f5e",
  "Đã trả": "#10b981",
};

function DashboardView() {
  const [dashboard, setDashboard] = useState({
    loanTickets: [],
    overview: {},
    overdueTickets: [],
    topBorrowedBooks: [],
    topReaders: [],
  });
  const [loading, setLoading] = useState(true);

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
          topReaders: (loanStatsResponse.data?.theoDocGia ?? []).slice(0, 3),
          topBorrowedBooks: (loanStatsResponse.data?.sachMuonNhieu ?? []).slice(0, 3),
          overdueTickets: loans.filter((ticket) => getMuonTraStatus(ticket) === "Quá hạn"),
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
  const monthlyLoanData = useMemo(() => buildMonthlyLoanData(loanTickets), [loanTickets]);
  const statusData = useMemo(() => buildStatusData(loanTickets), [loanTickets]);

  return (
    <MainLayout compact>
      <div className="dashboard-page mx-auto flex h-full max-w-[1600px] flex-col gap-3">
        <DashboardHeader overdueCount={overdueTickets.length} />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {STAT_STYLES.map((stat) => (
                <StatCard key={stat.valueKey} {...stat} value={overview[stat.valueKey] ?? 0} />
              ))}
            </section>

            <section className="dashboard-content-grid grid min-h-0 flex-1 gap-3 xl:grid-cols-12 xl:grid-rows-2">
              <div className="min-h-0 xl:col-span-5">
                <LoanTrendChart data={monthlyLoanData} />
              </div>
              <div className="min-h-0 xl:col-span-4">
                <RankingCard
                  icon={Users}
                  label="Độc giả"
                  rows={topReaders}
                  subtitle="Những độc giả có nhiều phiếu mượn nhất"
                  title="Top độc giả tích cực"
                  valueKey="TongPhieuMuon"
                />
              </div>
              <div className="min-h-0 xl:col-span-3">
                <FineSummary value={overview.TongTienPhatDaThu ?? 0} />
              </div>

              <div className="min-h-0 xl:col-span-4">
                <RankingCard
                  icon={BookOpen}
                  label="Sách"
                  rows={topBorrowedBooks}
                  subtitle="Các đầu sách được mượn nhiều nhất"
                  title="Sách được quan tâm"
                  valueKey="TongLuotMuon"
                />
              </div>
              <div className="min-h-0 xl:col-span-5">
                <OverdueTable tickets={overdueTickets} />
              </div>
              <div className="min-h-0 xl:col-span-3">
                <LoanStatusChart data={statusData} total={loanTickets.length} />
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function DashboardHeader({ overdueCount }) {
  return (
    <section className="relative min-h-[118px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-6 py-5 text-white shadow-lg shadow-orange-500/10">
      <div className="absolute -right-8 -top-24 size-64 rounded-full border-[34px] border-white/5" />
      <div className="absolute -bottom-28 right-56 size-56 rounded-full border-[30px] border-white/5" />
      <div className="relative flex h-full items-center justify-between gap-5">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/15">
            <CalendarClock className="size-3.5" />
            Tổng quan hệ thống
          </div>
          <h1 className="text-2xl font-black tracking-tight md:text-[28px]">Thống kê và báo cáo</h1>
          <p className="mt-1 max-w-xl text-sm font-medium leading-snug text-orange-50">
            Theo dõi dữ liệu mượn–trả, độc giả và kho sách trong một màn hình.
          </p>
        </div>

        <Link
          className="hidden items-center gap-3 rounded-2xl bg-white/15 p-3 pr-4 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20 sm:flex"
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

function StatCard({ icon: Icon, iconClass, label, value }) {
  return (
    <article className="flex min-h-[94px] items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
          {Number(value).toLocaleString("vi-VN")}
        </p>
        <p className="text-[11px] text-slate-400">Dữ liệu hiện tại</p>
      </div>
    </article>
  );
}

function DashboardCard({ children, className = "" }) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[230px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80",
        className,
      )}
    >
      {children}
    </article>
  );
}

function CardHeading({ action, icon: Icon, subtitle, title }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-3.5">
      <div className="flex min-w-0 items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-extrabold text-slate-900">{title}</h2>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function LoanTrendChart({ data }) {
  return (
    <DashboardCard>
      <CardHeading
        action={
          <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">
            6 tháng
          </span>
        }
        icon={BarChartIcon}
        subtitle="Số phiếu mượn được tạo trong 6 tháng gần nhất"
        title="Xu hướng mượn sách"
      />
      <div className="min-h-0 flex-1 px-2 pb-2">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ bottom: 0, left: -30, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="loanTrendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
            <XAxis axisLine={false} dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
            <Tooltip content={<ChartTooltip valueSuffix="phiếu" />} cursor={{ stroke: "#fdba74" }} />
            <Area
              activeDot={{ fill: "#fff", r: 4, stroke: "#f97316", strokeWidth: 2 }}
              dataKey="value"
              fill="url(#loanTrendGradient)"
              stroke="#f97316"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}

function BarChartIcon({ className }) {
  return <Trophy className={className} />;
}

function RankingCard({ icon: Icon, label, rows, subtitle, title, valueKey }) {
  const highestValue = Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);

  return (
    <DashboardCard>
      <CardHeading icon={Trophy} subtitle={subtitle} title={title} />
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2.5 px-4 pb-3">
        {rows.length ? (
          rows.map((row, index) => {
            const value = Number(row[valueKey]) || 0;
            const name = row.TenDG ?? row.TenSach ?? `Chưa có tên ${label.toLowerCase()}`;

            return (
              <div className="grid grid-cols-[28px_1fr_auto] items-center gap-2.5" key={row.MaDG ?? row.MaSach}>
                <span
                  className={`flex size-7 items-center justify-center rounded-lg text-[11px] font-black ${
                    index === 0 ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3 shrink-0 text-slate-400" />
                    <p className="truncate text-xs font-bold text-slate-700">{name}</p>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                      style={{ width: `${Math.max(8, (value / highestValue) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-orange-600">{value} lượt</span>
              </div>
            );
          })
        ) : (
          <EmptyState message={`Chưa có dữ liệu ${label.toLowerCase()}.`} />
        )}
      </div>
    </DashboardCard>
  );
}

function FineSummary({ value }) {
  return (
    <DashboardCard className="bg-[#0b1730] text-white ring-[#132443]">
      <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-white">Tiền phạt đã thu</h2>
          <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
            Tổng tiền phạt từ các phiếu đã hoàn trả
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/10">
          <Banknote className="size-5" />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end px-5 pb-4">
        <p className="text-[28px] font-black leading-none tracking-tight text-white">
          {formatCurrency(value)}
        </p>
        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#172541]">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]" />
        </div>
        <p className="mt-3 text-[10px] font-medium text-slate-400">
          Ghi nhận tự động từ nghiệp vụ trả sách
        </p>
      </div>
    </DashboardCard>
  );
}

function OverdueTable({ tickets }) {
  const today = getTodayValue();

  return (
    <DashboardCard>
      <CardHeading
        action={
          <Link
            className="rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600"
            to="/muon-tra"
          >
            Xem tất cả
          </Link>
        }
        icon={AlertTriangle}
        subtitle="Danh sách phiếu cần được liên hệ và xử lý sớm"
        title="Phiếu mượn quá hạn"
      />
      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3">
        {tickets.length ? (
          <div className="h-full overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full table-fixed text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="w-[17%] px-2 py-2 font-bold">Mã phiếu</th>
                  <th className="w-[29%] px-2 py-2 font-bold">Độc giả</th>
                  <th className="w-[21%] px-2 py-2 font-bold">Hạn trả</th>
                  <th className="w-[17%] px-2 py-2 font-bold">Trễ hạn</th>
                  <th className="px-2 py-2 text-right font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 3).map((ticket) => (
                  <tr className="border-t border-slate-100" key={ticket.MaMT}>
                    <td className="truncate px-2 py-2 font-black text-slate-800">{ticket.MaMT}</td>
                    <td className="truncate px-2 py-2 font-semibold text-slate-600">
                      {ticket.TenDG ?? ticket.MaDG}
                    </td>
                    <td className="px-2 py-2 text-slate-500">{formatDisplayDate(ticket.HanTra)}</td>
                    <td className="px-2 py-2 font-bold text-rose-500">
                      {getOverdueDays(ticket.HanTra, today)} ngày
                    </td>
                    <td className="px-2 py-2 text-right">
                      <StatusBadge status="Quá hạn" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="Không có phiếu mượn quá hạn." />
        )}
      </div>
    </DashboardCard>
  );
}

function LoanStatusChart({ data, total }) {
  return (
    <DashboardCard>
      <CardHeading subtitle="Phân bố toàn bộ phiếu mượn–trả" title="Trạng thái phiếu" />
      <div className="flex min-h-0 flex-1 items-center gap-1 px-3 pb-3">
        <div className="relative h-full min-h-28 flex-1">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cornerRadius={4}
                data={data}
                dataKey="value"
                innerRadius="55%"
                nameKey="name"
                outerRadius="78%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell fill={STATUS_CHART_COLORS[item.name]} key={item.name} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip valueSuffix="phiếu" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900">{total}</span>
            <span className="text-[9px] text-slate-400">Tổng phiếu</span>
          </div>
        </div>
        <div className="w-[44%] space-y-2">
          {data.map((item) => (
            <div className="flex items-center justify-between gap-2 text-[10px]" key={item.name}>
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: STATUS_CHART_COLORS[item.name] }} />
                <span className="truncate font-semibold text-slate-500">{item.name}</span>
              </div>
              <span className="font-black text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

function ChartTooltip({ active, label, payload, valueSuffix }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-lg">
      <p className="text-[10px] font-semibold text-slate-500">{label ?? item.name}</p>
      <p className="text-xs font-black text-slate-900">
        {item.value} {valueSuffix}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex h-full min-h-20 flex-col items-center justify-center text-center">
      <ClipboardCheck className="mb-1.5 size-6 text-emerald-500" />
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid min-h-0 flex-1 animate-pulse grid-cols-4 grid-rows-[94px_1fr_1fr] gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200" key={index} />
      ))}
      <div className="col-span-2 rounded-2xl bg-white ring-1 ring-slate-200" />
      <div className="col-span-2 rounded-2xl bg-white ring-1 ring-slate-200" />
      <div className="col-span-4 rounded-2xl bg-white ring-1 ring-slate-200" />
    </div>
  );
}

function buildMonthlyLoanData(tickets) {
  const currentMonth = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (5 - index), 1);
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;

    return {
      label: `Thg ${month.getMonth() + 1}`,
      value: tickets.filter((ticket) => String(ticket.NgayMuon ?? "").startsWith(monthKey)).length,
    };
  });
}

function buildStatusData(tickets) {
  const counts = { "Đang mượn": 0, "Quá hạn": 0, "Đã trả": 0 };
  tickets.forEach((ticket) => {
    const status = getMuonTraStatus(ticket);
    if (status in counts) counts[status] += 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default DashboardView;
