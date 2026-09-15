import { BookOpenCheck, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { errorMessage, readerApi } from "@/lib/api";
import { getSession, saveSession } from "@/utils/session";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ MaDG: "", Pass: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const existingSession = getSession();
  if (existingSession?.token) {
    return <Navigate replace to={existingSession.mustChangePassword ? "/doi-mat-khau" : "/"} />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await readerApi.login(form.MaDG.trim(), form.Pass);
      const session = saveSession(result);
      toast.success("Đăng nhập thành công");
      navigate(session.mustChangePassword ? "/doi-mat-khau" : (location.state?.from || "/"), { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "Mã sinh viên hoặc mật khẩu không đúng."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-brand p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-36 -left-24 size-96 rounded-full bg-accent/20" />
        <div className="relative flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-white font-black text-brand">UTT</span><div><p className="text-xl font-black">Thư viện UTT</p><p className="text-sm text-white/70">Cổng thông tin độc giả</p></div></div>
        <div className="relative max-w-xl"><BookOpenCheck className="mb-6 size-14 text-orange-300" /><h1 className="text-4xl font-black leading-tight">Sách gần hơn,<br />việc học thuận tiện hơn.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-white/75">Tra cứu tài liệu, gửi yêu cầu mượn trả và theo dõi hạn sách trong một nơi.</p></div>
        <p className="relative text-sm text-white/60">Trường Đại học Công nghệ Giao thông Vận tải</p>
      </section>
      <section className="flex items-center justify-center bg-[#f8f9fc] px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><span className="grid size-11 place-items-center rounded-xl bg-brand font-black text-white">UTT</span><div><p className="font-black text-brand">Thư viện UTT</p><p className="text-xs text-slate-500">Cổng thông tin độc giả</p></div></div>
          <div className="card p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-black text-brand">Đăng nhập độc giả</h1>
            <p className="mt-2 text-sm text-slate-500">Dùng mã sinh viên và mật khẩu của bạn.</p>
            <form className="mt-7 space-y-5" onSubmit={handleLogin}>
              <label className="block"><span className="mb-2 block text-sm font-extrabold text-slate-700">Mã sinh viên</span><input autoComplete="username" autoFocus className="field" maxLength="10" onChange={(event) => setForm({ ...form, MaDG: event.target.value })} placeholder="Ví dụ: DG001" required value={form.MaDG} /></label>
              <label className="block"><span className="mb-2 block text-sm font-extrabold text-slate-700">Mật khẩu</span><span className="relative block"><input autoComplete="current-password" className="field pr-12" maxLength="72" minLength="6" onChange={(event) => setForm({ ...form, Pass: event.target.value })} required type={showPassword ? "text" : "password"} value={form.Pass} /><button aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></span></label>
              <button className="button-primary w-full" disabled={submitting} type="submit">{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
            </form>
            <div className="mt-6 flex gap-2 rounded-lg bg-brand-soft p-3 text-xs leading-5 text-brand"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><p>Mật khẩu mặc định là <strong>123456</strong>. Bạn sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
