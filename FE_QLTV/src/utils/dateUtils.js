export function formatDisplayDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value ?? "";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
