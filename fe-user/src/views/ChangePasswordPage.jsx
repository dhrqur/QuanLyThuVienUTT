import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { errorMessage, readerApi } from "@/lib/api";
import { saveSession } from "@/utils/session";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ MatKhauCu: "", MatKhauMoi: "", XacNhan: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (form.MatKhauMoi !== form.XacNhan) return toast.error("Mật khẩu xác nhận chưa khớp.");
    if (form.MatKhauMoi.length < 6) return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
    setSubmitting(true);
    try {
      saveSession(await readerApi.changePassword({ MatKhauCu: form.MatKhauCu, MatKhauMoi: form.MatKhauMoi }));
      toast.success("Đổi mật khẩu thành công");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "Không thể đổi mật khẩu."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <section className="card w-full max-w-lg p-6 shadow-sm sm:p-9">
        <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent"><KeyRound className="size-6" /></span>
        <h1 className="mt-5 text-2xl font-black text-brand">Tạo mật khẩu mới</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Đây là lần đăng nhập đầu tiên. Hãy đổi mật khẩu tạm thời trước khi sử dụng cổng độc giả.</p>
        <form className="mt-7 space-y-5" onSubmit={submit}>
          <PasswordField label="Mật khẩu hiện tại" name="MatKhauCu" onChange={setForm} state={form} />
          <PasswordField label="Mật khẩu mới" name="MatKhauMoi" onChange={setForm} state={form} />
          <PasswordField label="Xác nhận mật khẩu mới" name="XacNhan" onChange={setForm} state={form} />
          <button className="button-primary w-full" disabled={submitting} type="submit">{submitting ? "Đang lưu..." : "Đổi mật khẩu và tiếp tục"}</button>
        </form>
        <div className="mt-5 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />Mật khẩu cần từ 6 đến 72 ký tự và không được trùng mật khẩu tạm thời.</div>
      </section>
    </main>
  );
}

function PasswordField({ label, name, onChange, state }) {
  return <label className="block"><span className="mb-2 block text-sm font-extrabold text-slate-700">{label}</span><input autoComplete="new-password" className="field" maxLength="72" minLength="6" onChange={(event) => onChange({ ...state, [name]: event.target.value })} required type="password" value={state[name]} /></label>;
}
