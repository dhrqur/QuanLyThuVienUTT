export function createLookup(danhSach, truongKhoa, truongGiaTri) {
  const danhSachCapGiaTri = danhSach.map((dongDuLieu) => [
    dongDuLieu[truongKhoa],
    dongDuLieu[truongGiaTri],
  ]);

  return Object.fromEntries(danhSachCapGiaTri);
}
