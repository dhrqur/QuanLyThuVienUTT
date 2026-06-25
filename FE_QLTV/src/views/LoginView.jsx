import { useState } from "react";
import { BookOpen, LockKeyhole, User } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, isLibrarian, isManager, login } from "@/utils/auth";

function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("nv1");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);

  if (getCurrentUser()) {
    return <Navigate replace to="/" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let user;
    try {
      user = await login(username, password);
    } catch (error) {
      toast.error("Đăng nhập thất bại", {
        description: error?.response?.data?.message || error.message,
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    const requestedPath = location.state?.from;
    const fallbackPath = isManager(user) ? "/" : "/muon-tra";
    const isForbiddenPath =
      isLibrarian(user) &&
      requestedPath === "/nhan-vien";

    navigate(isForbiddenPath ? fallbackPath : requestedPath || fallbackPath, {
      replace: true,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-4 py-8 text-slate-800">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl shadow-orange-950/10 md:grid-cols-[1fr_1fr]">
          <div className="relative min-h-80 overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-8 text-white md:p-12">
          <div className="absolute -right-12 -top-12 size-44 rounded-full bg-white/14" />
          <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-white/12" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/16 px-3 py-1 text-xs font-bold ring-1 ring-white/20">
              <BookOpen className="size-3.5" />
              NHÓM 7 - 74DCHT23
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/75">
                  Hệ thống
                </p>

                <h1 className="mt-3 whitespace-nowrap text-4xl font-black leading-tight md:text-5xl">
                  Quản lý thư viện
                </h1>
              </div>
            </div>
          </div>
        </div>
        <form className="flex flex-col justify-center p-8 md:p-12" onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Chào mừng quay lại</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Vui lòng nhập tài khoản để vào trang quản trị.
            </p>
          </div>

          <label className="mb-2 text-sm font-bold text-slate-700" htmlFor="username">
            Tên đăng nhập
          </label>
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-orange-400" />
            <Input
              className="h-11 rounded-xl border-orange-100 bg-orange-50/50 pl-10 font-semibold"
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
          </div>

          <label className="mb-2 text-sm font-bold text-slate-700" htmlFor="password">
            Mật khẩu
          </label>
          <div className="relative mb-4">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-orange-400" />
            <Input
              className="h-11 rounded-xl border-orange-100 bg-orange-50/50 pl-10 font-semibold"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </div>

          <label className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input className="size-4 accent-orange-500" type="checkbox" />
            Ghi nhớ đăng nhập
          </label>

          <Button className="h-11 rounded-xl bg-orange-500 font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600" disabled={loading} type="submit">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <p className="mt-5 text-center text-xs font-semibold text-slate-500">
            Quản lý: <span className="text-slate-800">nv1 / 123</span>
            <br />
            Thủ thư: <span className="text-slate-800">nv2 / 1234</span>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginView;
