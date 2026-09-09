import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Đang tải dữ liệu..." }) {
  return <div aria-busy="true" className="card flex min-h-56 items-center justify-center gap-3 text-slate-500"><LoaderCircle className="size-5 animate-spin" /><span className="font-semibold">{label}</span></div>;
}

export function ErrorState({ message, retry }) {
  return <div className="card min-h-56 p-10 text-center" role="alert"><AlertCircle className="mx-auto size-9 text-rose-500" /><h2 className="mt-3 font-black text-slate-800">Không thể tải dữ liệu</h2><p className="mt-1 text-sm text-slate-500">{message}</p>{retry && <button className="button-secondary mt-4" onClick={retry}>Thử lại</button>}</div>;
}

export function EmptyState({ message, title = "Chưa có dữ liệu" }) {
  return <div className="card min-h-48 p-10 text-center" role="status"><Inbox className="mx-auto size-9 text-slate-300" /><h2 className="mt-3 font-black text-slate-700">{title}</h2><p className="mt-1 text-sm text-slate-500">{message}</p></div>;
}
