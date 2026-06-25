export function getSachStatus(soLuong) {
  const quantity = Number(soLuong);

  if (quantity <= 0) return "Hết";
  if (quantity === 1) return "Sắp hết";
  return "Còn";
}
