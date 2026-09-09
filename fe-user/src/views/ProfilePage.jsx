import { CreditCard, KeyRound, Save, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ErrorState, LoadingState } from "@/components/common/PageState";
import ReaderLayout from "@/components/layout/ReaderLayout";
import { errorMessage, readerApi } from "@/lib/api";
import { formatDate } from "@/utils/format";
import { saveSession } from "@/utils/session";

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ DiaChi: "", Email: "", Sdt: "" });
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setError("");
      const dashboard = await readerApi.dashboard();
      setData(dashboard); setForm({ DiaChi: dashboard.profile.DiaChi || "", Email: dashboard.profile.Email || "", Sdt: dashboard.profile.Sdt || "" });
    } catch (requestError) { setError(errorMessage(requestError)); }
  }, []);
  useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  return <ReaderLayout>{!data && !error ? <LoadingState /> : error ? <ErrorState message={error} retry={load} /> : <ProfileContent data={data} form={form} setForm={setForm} />}</ReaderLayout>;
}

function ProfileContent({ data, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const profile = data.profile;
  async function saveProfile(event) {
    event.preventDefault(); setSaving(true);
    try { await readerApi.updateProfile(form); toast.success("Đã cập nhật thông tin cá nhân"); }
    catch (error) { toast.error(errorMessage(error, "Không thể cập nhật thông tin.")); }
    finally { setSaving(false); }
  }
  return <div className="space-y-6"><header><p className="text-sm font-bold text-accent">TÀI KHOẢN</p><h1 className="mt-1 text-2xl font-black text-brand sm:text-3xl">Thông tin cá nhân</h1><p className="mt-1 text-sm text-slate-500">Xem hồ sơ sinh viên và cập nhật thông tin liên hệ.</p></header><div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]"><section className="card p-5 sm:p-7"><div className="flex items-center gap-4 border-b border-slate-100 pb-5"><span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand"><UserRound className="size-7" /></span><div><h2 className="text-xl font-black text-slate-800">{profile.TenDG}</h2><p className="text-sm text-slate-500">{profile.MaDG} · {profile.TenLop || profile.MaLop}</p></div></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Info label="Ngày sinh" value={formatDate(profile.NamSinh)} /><Info label="Giới tính" value={profile.GioiTinh} /><Info label="Khoa" value={profile.TenKhoa || profile.MaKhoa} /><Info label="Lớp" value={profile.TenLop || profile.MaLop} /></dl><form className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2" onSubmit={saveProfile}><label className="block sm:col-span-2"><FieldLabel>Địa chỉ</FieldLabel><input className="field" maxLength="100" onChange={(event) => setForm({ ...form, DiaChi: event.target.value })} required value={form.DiaChi} /></label><label className="block"><FieldLabel>Email</FieldLabel><input className="field" maxLength="50" onChange={(event) => setForm({ ...form, Email: event.target.value })} required type="email" value={form.Email} /></label><label className="block"><FieldLabel>Số điện thoại</FieldLabel><input className="field" inputMode="numeric" maxLength="13" minLength="9" onChange={(event) => setForm({ ...form, Sdt: event.target.value.replace(/\D/g, "") })} pattern="[0-9]{9,13}" required value={form.Sdt} /></label><button className="button-primary flex items-center justify-center gap-2 sm:col-span-2 sm:ml-auto sm:w-fit" disabled={saving} type="submit"><Save className="size-4" />{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></form></section><aside className="space-y-6"><LibraryCard card={data.libraryCard} profile={profile} /><PasswordPanel /></aside></div></div>;
}

function Info({ label, value }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 font-extrabold text-slate-700">{value || "—"}</dd></div>; }
function FieldLabel({ children }) { return <span className="mb-2 block text-sm font-extrabold text-slate-700">{children}</span>; }

function LibraryCard({ card, profile }) {
  return <section className="overflow-hidden rounded-2xl bg-brand text-white shadow-sm"><div className="p-6"><CreditCard className="size-7 text-orange-300" /><p className="mt-5 text-xs font-bold tracking-widest text-white/60">THẺ THƯ VIỆN</p><p className="mt-1 text-2xl font-black">{card?.MaThe || "Chưa được cấp"}</p><p className="mt-5 font-bold">{profile.TenDG}</p><p className="text-xs text-white/60">Hết hạn: {formatDate(card?.NgayHetHan)}</p></div></section>;
}

function PasswordPanel() {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ MatKhauCu: "", MatKhauMoi: "", XacNhan: "" });
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (form.MatKhauMoi !== form.XacNhan) return toast.error("Mật khẩu xác nhận chưa khớp.");
    setSaving(true);
    try { saveSession(await readerApi.changePassword({ MatKhauCu: form.MatKhauCu, MatKhauMoi: form.MatKhauMoi })); setForm({ MatKhauCu: "", MatKhauMoi: "", XacNhan: "" }); setExpanded(false); toast.success("Đổi mật khẩu thành công"); }
    catch (error) { toast.error(errorMessage(error, "Không thể đổi mật khẩu.")); }
    finally { setSaving(false); }
  }
  return <section className="card p-5"><button aria-expanded={expanded} className="flex min-h-11 w-full items-center gap-3 text-left" onClick={() => setExpanded((value) => !value)}><span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent"><KeyRound className="size-5" /></span><span><strong className="block text-sm text-slate-800">Đổi mật khẩu</strong><span className="text-xs text-slate-500">Nên thay đổi định kỳ</span></span></button>{expanded && <form className="mt-4 space-y-3 border-t border-slate-100 pt-4" onSubmit={submit}>{[["MatKhauCu", "Mật khẩu hiện tại"], ["MatKhauMoi", "Mật khẩu mới"], ["XacNhan", "Xác nhận mật khẩu"]].map(([name, label]) => <label className="block" key={name}><span className="sr-only">{label}</span><input className="field" maxLength="72" minLength="6" onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={label} required type="password" value={form[name]} /></label>)}<button className="button-primary w-full" disabled={saving} type="submit">{saving ? "Đang lưu..." : "Xác nhận đổi"}</button></form>}</section>;
}
