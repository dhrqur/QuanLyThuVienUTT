import { useEffect, useState } from "react";
import { Banknote, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatDisplayDate } from "@/utils/dateUtils";
import { formatCurrency, formatCurrencyInput, normalizeCurrencyValue, sanitizeCurrencyInput } from "@/utils/numberUtils";

const FIELDS = [
  { key: "PhiQuaHanMoiNgay", label: "Phí quá hạn", unit: "mỗi ngày", note: "Áp dụng một lần cho toàn phiếu mượn." },
  { key: "PhiHuHongMoiBan", label: "Phí hư hỏng", unit: "mỗi bản", note: "Áp dụng theo số bản được đánh dấu hư hỏng." },
  { key: "PhiLamMatMoiBan", label: "Phí làm mất", unit: "mỗi bản", note: "Áp dụng theo số bản được đánh dấu làm mất." },
];

function QuyDinhThuVienView() {
  const [rules, setRules] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api.getLibraryRules()
      .then((response) => setRules(normalizeRules(response.data)))
      .catch((error) => toast.error("Không thể tải quy định", { description: getApiErrorMessage(error) }));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault(); setSaving(true);
    try {
      const payload = Object.fromEntries(FIELDS.map(({ key }) => [key, Number(rules[key])]));
      const response = await api.updateLibraryRules(payload);
      setRules(normalizeRules(response.data)); toast.success("Đã cập nhật mức phí áp dụng");
    } catch (error) { toast.error("Không thể cập nhật quy định", { description: getApiErrorMessage(error) }); }
    finally { setSaving(false); }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-5">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-orange-500">Thiết lập nghiệp vụ</p><h1 className="mt-1 text-2xl font-black text-[#25245A]">Quy định thư viện</h1><p className="mt-1 text-sm text-[#59617F]">Mức phí này được tự động áp dụng khi xác nhận trả sách.</p></div>
        {!rules ? <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">Đang tải quy định...</div> : (
          <form className="overflow-hidden rounded-2xl border border-slate-200 bg-white" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><ShieldCheck className="size-5" /></span><div><h2 className="font-extrabold text-slate-900">Mức phí xử lý vi phạm</h2><p className="text-xs text-slate-400">Không thể thay đổi tại màn hình trả sách.</p></div></div>
            <div className="grid gap-4 p-6 md:grid-cols-3">{FIELDS.map((field) => (
              <label className="rounded-xl border border-slate-200 p-4" key={field.key}>
                <span className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><Banknote className="size-4 text-orange-500" />{field.label}</span>
                <MoneyInput
                  onChange={(value) => setRules((current) => ({ ...current, [field.key]: value }))}
                  value={rules[field.key]}
                />
                <p className="mt-2 text-xs font-semibold text-orange-600">{formatCurrency(rules[field.key])} / {field.unit}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{field.note}</p>
              </label>
            ))}</div>
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">Cập nhật gần nhất: {formatDisplayDate(rules.NgayCapNhat)} {rules.TenNVCapNhat ? `· ${rules.TenNVCapNhat}` : ""}</p><Button className="bg-orange-500 font-bold hover:bg-orange-600" disabled={saving} type="submit"><Save className="size-4" />Lưu quy định</Button></div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}

function MoneyInput({ onChange, value }) {
  return (
    <div className="relative mt-3">
      <Input
        className="h-11 pr-10 text-lg font-black"
        inputMode="numeric"
        onChange={(event) => onChange(sanitizeCurrencyInput(event.target.value))}
        onFocus={(event) => event.target.select()}
        placeholder="0"
        type="text"
        value={formatCurrencyInput(value)}
      />
      <span className="pointer-events-none absolute right-3 top-3 text-sm font-bold text-slate-400">đ</span>
    </div>
  );
}

function normalizeRules(data) {
  return {
    ...data,
    ...Object.fromEntries(FIELDS.map(({ key }) => [key, normalizeCurrencyValue(data?.[key])])),
  };
}

export default QuyDinhThuVienView;
