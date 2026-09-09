import { Ban, BookUp, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingState } from "@/components/common/PageState";
import StatusBadge from "@/components/common/StatusBadge";
import ReaderLayout from "@/components/layout/ReaderLayout";
import { errorMessage, readerApi } from "@/lib/api";
import { formatDateTime } from "@/utils/format";

function getRequestFilters(status) {
  return status ? { trangThai: status } : {};
}

export default function RequestsPage() {
  const [status, setStatus] = useState("");
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState("");
  const loadRequests = useCallback(async () => {
    try {
      setError("");
      setRequests(await readerApi.requests(getRequestFilters(status)));
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, [status]);

  useEffect(() => {
    const timer = setTimeout(() => void loadRequests(), 0);
    return () => clearTimeout(timer);
  }, [loadRequests]);

  async function cancelRequest(id) {
    if (!window.confirm("Bạn chắc chắn muốn hủy yêu cầu này?")) return;

    try {
      await readerApi.cancelRequest(id);
      toast.success("Đã hủy yêu cầu");
      await loadRequests();
    } catch (requestError) {
      toast.error(errorMessage(requestError, "Không thể hủy yêu cầu."));
    }
  }

  return <ReaderLayout><div className="space-y-6"><header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold text-accent">THEO DÕI</p><h1 className="mt-1 text-2xl font-black text-brand sm:text-3xl">Yêu cầu của tôi</h1><p className="mt-1 text-sm text-slate-500">Theo dõi quá trình thủ thư xử lý yêu cầu mượn và trả sách.</p></div><label><span className="sr-only">Lọc trạng thái</span><select className="field min-w-44" onChange={(event) => setStatus(event.target.value)} value={status}><option value="">Tất cả trạng thái</option><option value="CHO_DUYET">Chờ duyệt</option><option value="DA_DUYET">Đã duyệt</option><option value="TU_CHOI">Từ chối</option><option value="DA_HUY">Đã hủy</option></select></label></header>{!requests && !error ? <LoadingState /> : error ? <ErrorState message={error} retry={loadRequests} /> : requests.length ? <div className="space-y-4">{requests.map((request) => <RequestCard cancel={cancelRequest} key={request.MaYC} request={request} />)}</div> : <EmptyState message="Các yêu cầu mượn hoặc trả sách sẽ xuất hiện tại đây." />}</div></ReaderLayout>;
}

function RequestCard({ cancel, request }) {
  const isBorrow = request.LoaiYeuCau === "MUON";
  const Icon = isBorrow ? BookUp : RotateCcw;
  return <article className="card p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex gap-3"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${isBorrow ? "bg-brand-soft text-brand" : "bg-emerald-50 text-emerald-700"}`}><Icon className="size-5" /></span><div><p className="font-black text-slate-800">Yêu cầu {isBorrow ? "mượn sách" : "trả sách"} #{request.MaYC}</p><p className="mt-1 text-xs text-slate-500">Gửi lúc {formatDateTime(request.NgayYeuCau)}</p></div></div><div className="flex items-center gap-3"><StatusBadge status={request.TrangThai} />{request.TrangThai === "CHO_DUYET" && <button className="flex min-h-10 items-center gap-1 rounded-lg px-3 text-xs font-black text-rose-600 hover:bg-rose-50" onClick={() => cancel(request.MaYC)}><Ban className="size-4" />Hủy</button>}</div></div>{isBorrow ? <ul className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">{request.ChiTiet.map((item) => <li className="flex justify-between gap-3 text-sm" key={item.MaSach}><span className="font-bold text-slate-700">{item.TenSach || item.MaSach}</span><span className="shrink-0 text-slate-500">× {item.SoLuong}</span></li>)}</ul> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Phiếu mượn: <strong>{request.MaMT}</strong></p>}{request.LyDoTuChoi && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"><strong>Lý do từ chối:</strong> {request.LyDoTuChoi}</p>}{request.NgayXuLy && <p className="mt-3 text-xs text-slate-400">Xử lý lúc {formatDateTime(request.NgayXuLy)}{request.TenNVXuLy ? ` bởi ${request.TenNVXuLy}` : ""}</p>}</article>;
}
