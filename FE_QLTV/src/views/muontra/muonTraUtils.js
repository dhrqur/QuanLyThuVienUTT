export function getOverdueDays(dueDate, returnDate) {
  if (!dueDate || !returnDate) return 0;
  const difference = new Date(`${returnDate}T00:00:00`) - new Date(`${dueDate}T00:00:00`);
  return Math.max(0, Math.ceil(difference / 86_400_000));
}
