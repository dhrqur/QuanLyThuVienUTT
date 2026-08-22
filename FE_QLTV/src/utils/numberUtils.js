const viNumberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const viCurrencyFormatter = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  maximumFractionDigits: 0,
  style: "currency",
});

export function toNumber(value) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

export function formatNumber(value) {
  return viNumberFormatter.format(toNumber(value));
}

export function formatCurrency(value) {
  return viCurrencyFormatter.format(toNumber(value));
}

export function sanitizeCurrencyInput(value) {
  return String(value ?? "").replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

export function formatCurrencyInput(value) {
  const digits = sanitizeCurrencyInput(value);
  return digits ? formatNumber(digits) : "";
}

export function normalizeCurrencyValue(value) {
  return String(Math.max(0, Math.round(toNumber(value))));
}
