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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatDisplayDate } from "@/utils/dateUtils";
import {
  formatCurrency,
  getMuonTraStatus,
  getOverdueDays,
  getTodayValue,
} from "@/views/muontra/muonTraUtils";

const STAT_STYLES = [
  {
    icon: BookOpen,
    iconClass: "bg-blue-50 text-blue-600 ring-blue-100",
    label: "Đầu sách",
    valueKey: "TongSach",
  },
  {
    icon: ClipboardCheck,
    iconClass: "bg-violet-50 text-violet-600 ring-violet-100",
    label: "Phiếu mượn",
    valueKey: "TongPhieuMuon",
  },
  {
    icon: Users,
    iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    label: "Độc giả",
    valueKey: "TongDocGia",
  },
  {
    icon: BookCopy,
    iconClass: "bg-amber-50 text-amber-600 ring-amber-100",
    label: "Tổng số bản sách",
    valueKey: "TongSoLuongSach",
  },
];

const STATUS_CHART_COLORS = {
  "Đang mượn": "#3b82f6",
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

        setDashboard({
          loanTickets: loansResponse.data ?? [],
          overview: overviewResponse.data?.tongQuan ?? {},
          topReaders: (loanStatsResponse.data?.theoDocGia ?? []).slice(0, 5),
          topBorrowedBooks: (loanStatsResponse.data?.sachMuonNhieu ?? []).slice(0, 5),
          overdueTickets: (loansResponse.data ?? []).filter(
            (ticket) => getMuonTraStatus(ticket) === "Quá hạn",
          ),
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
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader overdueCount={overdueTickets.length} />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STAT_STYLES.map((stat) => (
                <StatCard
                  key={stat.valueKey}
                  {...stat}
                  value={overview[stat.valueKey] ?? 0}
                />
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
              <LoanTrendChart data={monthlyLoanData} />
              <LoanStatusChart data={statusData} total={loanTickets.length} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
              <RankingCard
                icon={Users}
                label="Độc giả"
                rows={topReaders}
                subtitle="Những độc giả có nhiều phiếu mượn nhất"
                title="Top độc giả tích cực"
                valueKey="TongPhieuMuon"
              />
              <FineSummary value={overview.TongTienPhatDaThu ?? 0} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.8fr_1.4fr]">
              <RankingCard
                icon={BookOpen}
                label="Sách"
                rows={topBorrowedBooks}
                subtitle="Các đầu sách được mượn nhiều nhất"
                title="Sách được quan tâm"
                valueKey="TongLuotMuon"
              />
              <OverdueTable tickets={overdueTickets} />
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function LoanTrendChart({ data }) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100">
        <div>
          <CardTitle className="font-extrabold text-slate-900">Xu hướng mượn sách</CardTitle>
          <CardDescription className="mt-1">
            Số phiếu mượn được tạo trong 6 tháng gần nhất
          </CardDescription>
        </div>
        <CardAction>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
            6 tháng
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data} margin={{ bottom: 0, left: -22, right: 8, top: 12 }}>
              <defs>
                <linearGradient id="loanTrendGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip valueSuffix="phiếu" />} cursor={{ stroke: "#fdba74" }} />
              <Area
                activeDot={{ fill: "#fff", r: 5, stroke: "#f97316", strokeWidth: 3 }}
                dataKey="value"
                fill="url(#loanTrendGradient)"
                stroke="#f97316"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function LoanStatusChart({ data, total }) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="font-extrabold text-slate-900">Trạng thái phiếu</CardTitle>
        <CardDescription>Phân bố toàn bộ phiếu mượn–trả</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative h-52">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cornerRadius={6}
                data={data}
                dataKey="value"
                innerRadius={62}
                nameKey="name"
                outerRadius={86}
                paddingAngle={3}
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
            <span className="text-3xl font-black text-slate-900">{total}</span>
            <span className="text-xs font-semibold text-slate-400">Tổng phiếu</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.map((item) => (
            <div className="flex items-center justify-between text-sm" key={item.name}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_CHART_COLORS[item.name] }}
                />
                <span className="font-semibold text-slate-600">{item.name}</span>
              </div>
              <span className="font-black text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartTooltip({ active, label, payload, valueSuffix }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const title = label ?? item.name;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-0.5 text-sm font-black text-slate-900">
        {item.value} {valueSuffix}
      </p>
    </div>
  );
}

function DashboardHeader({ overdueCount }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 p-6 text-white shadow-lg shadow-orange-500/15 md:p-8">
      <div className="absolute -right-16 -top-20 size-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 right-28 size-52 rounded-full bg-white/10" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
            <CalendarClock className="size-3.5" />
            Tổng quan vận hành thư viện
          </div>
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            Thống kê và báo cáo
          </h1>
          <p className="mt-2 text-sm font-medium text-orange-50 md:text-base">
            Theo dõi dữ liệu mượn–trả, độc giả và kho sách trong một màn hình.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
          <span className="flex size-10 items-center justify-center rounded-lg bg-white text-orange-600">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-orange-100">Cần xử lý</p>
            <p className="text-lg font-black">{overdueCount} phiếu quá hạn</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, iconClass, label, value }) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-slate-500">{label}</CardTitle>
        <CardAction>
          <span className={`flex size-10 items-center justify-center rounded-xl ring-1 ${iconClass}`}>
            <Icon className="size-5" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black tracking-tight text-slate-900">
          {Number(value).toLocaleString("vi-VN")}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">Dữ liệu hiện tại</p>
      </CardContent>
    </Card>
  );
}

function FineSummary({ value }) {
  return (
    <Card className="border-0 bg-slate-900 text-white shadow-lg shadow-slate-900/10 ring-1 ring-slate-800">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-200">Tiền phạt đã thu</CardTitle>
        <CardDescription className="text-slate-400">
          Tổng tiền phạt từ các phiếu đã hoàn trả
        </CardDescription>
        <CardAction>
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
            <Banknote className="size-5" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end">
        <p className="text-3xl font-black tracking-tight text-white">{formatCurrency(value)}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">
          Ghi nhận tự động từ nghiệp vụ trả sách
        </p>
      </CardContent>
    </Card>
  );
}

function RankingCard({ icon: Icon, label, rows, subtitle, title, valueKey }) {
  const highestValue = Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);

  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
            <Trophy className="size-5" />
          </span>
          <div>
            <CardTitle className="font-extrabold text-slate-900">{title}</CardTitle>
            <CardDescription className="mt-1">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {rows.length ? (
            rows.map((row, index) => {
              const value = Number(row[valueKey]) || 0;
              const name = row.TenDG ?? row.TenSach ?? `Chưa có tên ${label.toLowerCase()}`;

              return (
                <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3" key={row.MaDG ?? row.MaSach}>
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg text-xs font-black ${
                      index === 0
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 shrink-0 text-slate-400" />
                      <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                        style={{ width: `${Math.max(8, (value / highestValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700">
                    {value} lượt
                  </span>
                </div>
              );
            })
          ) : (
            <EmptyState message={`Chưa có dữ liệu ${label.toLowerCase()}.`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OverdueTable({ tickets }) {
  const today = getTodayValue();

  return (
    <Card className="border-0 shadow-sm ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100">
        <div>
          <CardTitle className="flex items-center gap-2 font-extrabold text-slate-900">
            <AlertTriangle className="size-5 text-rose-500" />
            Phiếu mượn quá hạn
          </CardTitle>
          <CardDescription className="mt-1">
            Danh sách phiếu cần được liên hệ và xử lý sớm
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild className="border-orange-200 text-orange-700 hover:bg-orange-50" variant="outline">
            <Link to="/muon-tra">
              Xem tất cả
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="pl-4 text-xs font-bold text-slate-500">Mã phiếu</TableHead>
              <TableHead className="text-xs font-bold text-slate-500">Độc giả</TableHead>
              <TableHead className="text-xs font-bold text-slate-500">Hạn trả</TableHead>
              <TableHead className="text-xs font-bold text-slate-500">Trễ hạn</TableHead>
              <TableHead className="pr-4 text-right text-xs font-bold text-slate-500">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length ? (
              tickets.slice(0, 6).map((ticket) => (
                <TableRow key={ticket.MaMT}>
                  <TableCell className="pl-4 font-black text-slate-800">{ticket.MaMT}</TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {ticket.TenDG ?? ticket.MaDG}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDisplayDate(ticket.HanTra)}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-rose-600">
                      {getOverdueDays(ticket.HanTra, today)} ngày
                    </span>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <StatusBadge status="Quá hạn" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState message="Không có phiếu mượn quá hạn." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center text-center">
      <ClipboardCheck className="mb-2 size-7 text-emerald-500" />
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="h-32 animate-pulse rounded-xl bg-white ring-1 ring-slate-200"
            key={index}
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-white ring-1 ring-slate-200" />
        <div className="h-80 animate-pulse rounded-xl bg-white ring-1 ring-slate-200" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-white ring-1 ring-slate-200" />
        <div className="h-80 animate-pulse rounded-xl bg-white ring-1 ring-slate-200" />
      </div>
    </div>
  );
}

function buildMonthlyLoanData(tickets) {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    month: "short",
    year: "2-digit",
  });
  const currentMonth = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const month = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - (5 - index),
      1,
    );
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;

    return {
      label: formatter.format(month),
      value: tickets.filter((ticket) => String(ticket.NgayMuon ?? "").startsWith(monthKey)).length,
    };
  });
}

function buildStatusData(tickets) {
  const counts = {
    "Đang mượn": 0,
    "Quá hạn": 0,
    "Đã trả": 0,
  };

  tickets.forEach((ticket) => {
    counts[getMuonTraStatus(ticket)] += 1;
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default DashboardView;
