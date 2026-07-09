import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookCopy,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import StatusBadge from "@/components/common/StatusBadge";
import MainLayout from "@/components/layout/MainLayout";
import { api, getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/utils/dateUtils";
import { getOverdueDays, getTodayValue } from "@/views/muontra/muonTraUtils";

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

  return (
    <MainLayout compact>
      <div className="dashboard-page mx-auto flex h-full max-w-[1600px] flex-col gap-2.5">
        <DashboardHeader overdueCount={overdueTickets.length} />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="grid shrink-0 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {STAT_STYLES.map((stat) => (
                <StatCard key={stat.valueKey} {...stat} value={overview[stat.valueKey] ?? 0} />
              ))}
            </section>

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

function DashboardHeader({ overdueCount }) {
  return (
    <section className="relative min-h-[90px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-6 py-3.5 text-white shadow-lg shadow-orange-500/10">
      <div className="absolute -right-8 -top-24 size-64 rounded-full border-[34px] border-white/5" />
      <div className="absolute -bottom-28 right-56 size-56 rounded-full border-[30px] border-white/5" />
      <div className="relative flex h-full items-center justify-between gap-5">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/15">
            <CalendarClock className="size-3.5" />
            Tổng quan hệ thống
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight md:text-[26px]">Thống kê và báo cáo</h1>
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

function StatCard({ icon: Icon, iconClass, label, value }) {
  return (
    <article className="flex min-h-[72px] items-center gap-3.5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-2xl font-black leading-tight tracking-tight text-slate-900">
          {Number(value).toLocaleString("vi-VN")}
        </p>
        <p className="text-[10px] text-slate-400">Dữ liệu hiện tại</p>
      </div>
    </article>
  );
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
