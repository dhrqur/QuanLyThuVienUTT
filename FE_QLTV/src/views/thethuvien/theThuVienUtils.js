export function getCardStatus(expirationDate) {
  if (!expirationDate) {
    return "Hết hạn";
  }

  return expirationDate < getTodayValue() ? "Hết hạn" : "Còn hiệu lực";
}

export function addYears(dateValue, years) {
  const baseDate = new Date(`${dateValue || getTodayValue()}T00:00:00`);
  baseDate.setFullYear(baseDate.getFullYear() + years);
  return formatDateInput(baseDate);
}

export function getMinimumRenewalDate(expirationDate) {
  const laterDate = expirationDate > getTodayValue() ? expirationDate : getTodayValue();
  const date = new Date(`${laterDate}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return formatDateInput(date);
}

function getTodayValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function formatDateInput(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}
