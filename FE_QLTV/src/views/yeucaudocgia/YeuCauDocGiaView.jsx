import { useCallback, useEffect, useState } from "react";
import { Inbox, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import StatusBadge from "@/components/common/StatusBadge";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatDisplayDate } from "@/utils/dateUtils";
import {
  ApproveBorrowDialog,
  RejectRequestDialog,
} from "@/views/yeucaudocgia/components/RequestActionDialogs";

function YeuCauDocGiaView() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ trangThai: "CHO_DUYET", keyword: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loadRequestPageData(filters);
      setRequests(data.requests);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [loadData]);

  async function perform(action, successMessage) {
    try {
      await action();
      toast.success(successMessage);
      await loadData();
    } catch (actionError) {
      toast.error("Không thể xử lý yêu cầu", { description: getApiErrorMessage(actionError) });
      throw actionError;
    }
  }

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1500px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Nghiệp vụ</p>
            <h1 className="mt-1 text-2xl font-black text-[#25245A]">Yêu cầu độc giả</h1>
          </div>
          <Button className="h-10 self-start" onClick={loadData} variant="outline">
            <RefreshCw /> Làm mới
          </Button>
        </header>

        <div className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_180px]">
          <label className="relative">
            <span className="sr-only">Tìm yêu cầu</span>
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <Input
              className="h-10 bg-white pl-9"
              onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))}
              placeholder="Tìm mã yêu cầu hoặc độc giả..."
              value={filters.keyword}
            />
          </label>
          <FilterSelect
            label="Trạng thái"
            onChange={(value) => setFilters((current) => ({ ...current, trangThai: value }))}
            options={[['', 'Tất cả trạng thái'], ['CHO_DUYET', 'Chờ duyệt'], ['DA_DUYET', 'Đã duyệt'], ['DA_LAY', 'Đã lấy'], ['TU_CHOI', 'Từ chối'], ['DA_HUY', 'Đã hủy']]}
            value={filters.trangThai}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={loadData} /> : !requests.length ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Yêu cầu</th><th className="px-4 py-3">Độc giả</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3">Ngày gửi</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <RequestRow key={request.MaYC} onAction={perform} request={request} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

function RequestRow({ onAction, request }) {
  const pending = request.TrangThai === "CHO_DUYET";
  const description = getRequestDescription(request);
  return (
    <tr className="align-top">
      <td className="px-4 py-3"><strong>#{request.MaYC}</strong><p className="mt-1 text-xs text-slate-500">Mượn sách</p></td>
      <td className="px-4 py-3"><strong>{request.TenDG}</strong><p className="mt-1 text-xs text-slate-500">{request.MaDG}</p></td>
      <td className="max-w-sm px-4 py-3 text-slate-600"><p className="line-clamp-2" title={description}>{description}</p>{request.LyDoTuChoi && <p className="mt-1 text-xs text-rose-600">{request.LyDoTuChoi}</p>}</td>
      <td className="px-4 py-3 text-slate-600">{formatDisplayDate(request.NgayYeuCau)}</td>
      <td className="px-4 py-3"><StatusBadge status={request.TrangThai} /></td>
      <td className="px-4 py-3"><div className="flex justify-end gap-2">
<<<<<<< HEAD
        {pending && request.LoaiYeuCau === "MUON" && <ApproveBorrowDialog onApprove={(data) => onAction(() => api.approveReaderBorrowRequest(request.MaYC, data), "Đã duyệt yêu cầu mượn")} request={request} />}
        {request.TrangThai === "DA_DUYET" && request.LoaiYeuCau === "MUON" && <ApproveBorrowDialog pickup onApprove={(data) => onAction(() => api.confirmReaderPickup(request.MaYC, data), "Đã xác nhận độc giả lấy sách")} request={request} />}
        {pending && request.LoaiYeuCau === "TRA" && loan && <TraSachDialog books={books} details={loan.ChiTiet ?? []} onReturned={(data) => onAction(() => api.approveReaderReturnRequest(request.MaYC, data), "Đã duyệt yêu cầu trả")} row={loan} rules={rules} successTitle="Duyệt trả sách thành công" triggerLabel="Duyệt trả" />}
=======
        {pending && <ApproveBorrowDialog onApprove={(data) => onAction(() => api.approveReaderBorrowRequest(request.MaYC, data), "Đã duyệt yêu cầu mượn")} request={request} />}
>>>>>>> origin/main
        {pending && <RejectRequestDialog onReject={(data) => onAction(() => api.rejectReaderRequest(request.MaYC, data), "Đã từ chối yêu cầu")} request={request} />}
      </div></td>
    </tr>
  );
}

async function loadRequestPageData(filters) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value),
  );
  const requestResponse = await api.getReaderRequests(params);

  return {
    requests: requestResponse.data ?? [],
  };
}

function getRequestDescription(request) {
  return request.ChiTiet
    .map((item) => `${item.TenSach || item.MaSach} × ${item.SoLuong}`)
    .join(", ");
}

function FilterSelect({ label, onChange, options, value }) {
  return <label><span className="sr-only">{label}</span><select aria-label={label} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" onChange={(event) => onChange(event.target.value)} value={value}>{options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select></label>;
}

function LoadingState() { return <div aria-busy="true" className="space-y-3 p-6"><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="h-12 animate-pulse rounded-lg bg-slate-100" /></div>; }
function ErrorState({ message, retry }) { return <div className="p-10 text-center" role="alert"><p className="font-bold text-rose-700">Không thể tải yêu cầu</p><p className="mt-1 text-sm text-slate-500">{message}</p><Button className="mt-4" onClick={retry} variant="outline">Thử lại</Button></div>; }
function EmptyState() { return <div className="p-12 text-center" role="status"><Inbox className="mx-auto size-10 text-slate-300" /><h2 className="mt-3 font-bold text-slate-700">Không có yêu cầu phù hợp</h2><p className="mt-1 text-sm text-slate-500">Thay đổi bộ lọc hoặc chờ độc giả gửi yêu cầu mới.</p></div>; }

export default YeuCauDocGiaView;
