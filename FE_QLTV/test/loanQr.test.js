import assert from "node:assert/strict";
import test from "node:test";
import { addScannedBook, resolveScannedReader } from "../src/views/muontra/loanQr.js";

const today = "2026-10-01";
const cards = [
  { MaThe: "TTV001", MaDG: "DG001", NgayCap: "2026-01-01", NgayHetHan: "2026-12-31" },
  { MaThe: "TTV002", MaDG: "DG001", NgayCap: "2025-01-01", NgayHetHan: "2025-12-31" },
  { MaThe: "TTV003", MaDG: "DG001", NgayCap: "2026-12-01", NgayHetHan: "2027-12-31" },
];
const readers = [{ value: "DG001", label: "DG001 - Nguyễn Văn A", errorMessage: "" }];

test("scanned active card selects its reader including issue/expiry date boundaries", () => {
  assert.equal(resolveScannedReader("TTV001", cards, readers, today), "DG001");
  assert.equal(resolveScannedReader("TTV001", cards, readers, "2026-01-01"), "DG001");
  assert.equal(resolveScannedReader("TTV001", cards, readers, "2026-12-31"), "DG001");
});

test("scanning an expired or future card fails even when another card is active", () => {
  assert.throws(() => resolveScannedReader("TTV002", cards, readers, today), /hết hạn/);
  assert.throws(() => resolveScannedReader("TTV003", cards, readers, today), /chưa có hiệu lực/);
});

test("unknown card and missing reader fail explicitly", () => {
  assert.throws(() => resolveScannedReader("MISSING", cards, readers, today), /thẻ/);
  assert.throws(() => resolveScannedReader("TTV001", cards, [], today), /độc giả/);
});

test("existing borrowing restrictions also apply to scanned readers", () => {
  const blockedReaders = [{ ...readers[0], errorMessage: "Độc giả đang có phiếu MT001 chưa trả." }];
  assert.throws(() => resolveScannedReader("TTV001", cards, blockedReaders, today), /MT001/);
});

test("each deliberate scan adds one copy without changing other selections", () => {
  const selected = { S002: 2 };
  const books = [{ MaSach: "S001", SoLuong: 2 }];
  const first = addScannedBook("S001", books, selected);
  const second = addScannedBook("S001", books, first);
  assert.deepEqual(second, { S002: 2, S001: 2 });
  assert.deepEqual(selected, { S002: 2 });
  assert.throws(() => addScannedBook("S001", books, second), /số lượng/);
});

test("unknown and out-of-stock books cannot be scanned into a loan", () => {
  assert.throws(() => addScannedBook("MISSING", [], {}), /sách/);
  assert.throws(() => addScannedBook("S001", [{ MaSach: "S001", SoLuong: 0 }], {}), /số lượng/);
});

test("editing counts already-borrowed copies in the quantity limit", () => {
  const books = [{ MaSach: "S001", SoLuong: 1 }];
  const existing = [{ MaSach: "S001", SoLuong: 2 }];
  const selected = addScannedBook("S001", books, { S001: "2" }, existing);
  assert.equal(selected.S001, 3);
  assert.throws(() => addScannedBook("S001", books, selected, existing), /số lượng/);
});
