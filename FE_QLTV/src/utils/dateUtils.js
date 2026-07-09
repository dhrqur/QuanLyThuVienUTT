export function formatDisplayDate(giaTriNgay) {
  const khongPhaiNgayHopLe = !giaTriNgay || !/^\d{4}-\d{2}-\d{2}$/.test(giaTriNgay);

  if (khongPhaiNgayHopLe) {
    return giaTriNgay ?? "";
  }

  const [nam, thang, ngay] = giaTriNgay.split("-");
  return `${ngay}/${thang}/${nam}`;
}
