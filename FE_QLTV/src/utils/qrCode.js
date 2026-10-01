const RESERVED_IDENTIFIERS = new Set(["__proto__", "constructor", "prototype"]);

export function parseQrIdentifier(value, expectedType) {
  const payload = String(value ?? "").trim();
  if (!payload || payload.length > 32) {
    throw new Error("Mã QR trống hoặc quá dài.");
  }

  let identifier = payload;
  if (payload.includes(":")) {
    const [prefix, type, id, extra] = payload.split(":");
    if (prefix !== "UTT" || type !== expectedType) {
      throw new Error(`Mã QR không đúng loại ${expectedType === "CARD" ? "thẻ thư viện" : "sách"}.`);
    }
    if (extra !== undefined) throw new Error("Định dạng mã QR không hợp lệ.");
    identifier = id;
  }

  if (!/^[a-zA-Z0-9_-]{1,10}$/.test(identifier ?? "") || RESERVED_IDENTIFIERS.has(identifier)) {
    throw new Error("Mã phải gồm 1–10 ký tự chữ, số, dấu gạch ngang hoặc gạch dưới.");
  }
  return identifier;
}
