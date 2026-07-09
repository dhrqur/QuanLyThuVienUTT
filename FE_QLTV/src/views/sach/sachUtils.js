export function getSachStatus(soLuong) {
  const soLuongSach = Number(soLuong);

  if (soLuongSach <= 0) {
    return "Hết";
  }

  if (soLuongSach === 1) {
    return "Sắp hết";
  }

  return "Còn";
}
