import { getLocalDateValue } from "@/utils/dateUtils";

export function getCardStatus(expirationDate) {
  if (!expirationDate) {
    return "Hết hạn";
  }

  return expirationDate < getLocalDateValue() ? "Hết hạn" : "Còn hiệu lực";
}

export function addYears(dateValue, years) {
  const baseDate = new Date(`${dateValue || getLocalDateValue()}T00:00:00`);
  baseDate.setFullYear(baseDate.getFullYear() + years);
  return formatDateInput(baseDate);
}

export function getMinimumRenewalDate(expirationDate) {
  const today = getLocalDateValue();
  const laterDate = expirationDate > today ? expirationDate : today;
  const date = new Date(`${laterDate}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return formatDateInput(date);
}

function formatDateInput(date) {
  return getLocalDateValue(date);
}
