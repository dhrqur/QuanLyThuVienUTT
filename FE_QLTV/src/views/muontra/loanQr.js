export function resolveScannedReader(cardId, libraryCards, readerOptions, today) {
  const card = libraryCards.find((item) => String(item.MaThe) === cardId);
  if (!card) throw new Error("Không tìm thấy thẻ thư viện có mã này. Hãy kiểm tra mã hoặc tải lại dữ liệu.");

  const issuedDate = String(card.NgayCap ?? "").slice(0, 10);
  const expirationDate = String(card.NgayHetHan ?? "").slice(0, 10);
  if (!issuedDate || !expirationDate) throw new Error("Thẻ thư viện chưa có đầy đủ ngày hiệu lực.");
  if (issuedDate > today) throw new Error("Thẻ thư viện này chưa có hiệu lực.");
  if (expirationDate < today) throw new Error("Thẻ thư viện này đã hết hạn. Vui lòng gia hạn thẻ trước khi mượn sách.");

  const reader = readerOptions.find((item) => String(item.value) === String(card.MaDG));
  if (!reader) throw new Error("Không tìm thấy độc giả của thẻ thư viện này.");
  if (reader.errorMessage) throw new Error(reader.errorMessage);
  return reader.value;
}

export function addScannedBook(bookId, books, selectedBooks, existingDetails = []) {
  const book = books.find((item) => String(item.MaSach) === bookId);
  if (!book) throw new Error("Không tìm thấy sách có mã này. Hãy kiểm tra mã hoặc tải lại dữ liệu.");

  const borrowedQuantity = Number(existingDetails.find((item) => String(item.MaSach) === bookId)?.SoLuong || 0);
  const availableQuantity = Number(book.SoLuong || 0) + borrowedQuantity;
  const currentQuantity = Object.hasOwn(selectedBooks, bookId) ? Number(selectedBooks[bookId]) || 0 : 0;
  const nextQuantity = currentQuantity + 1;
  if (!Number.isInteger(availableQuantity) || availableQuantity < nextQuantity) {
    throw new Error(`Sách ${bookId} không đủ số lượng để thêm một bản.`);
  }
  return { ...selectedBooks, [bookId]: nextQuantity };
}
