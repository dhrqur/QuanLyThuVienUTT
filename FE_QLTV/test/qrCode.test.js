import assert from "node:assert/strict";
import test from "node:test";
import { parseQrIdentifier } from "../src/utils/qrCode.js";

test("accepts raw and typed card/book identifiers without changing case", () => {
  assert.equal(parseQrIdentifier(" TTV001 ", "CARD"), "TTV001");
  assert.equal(parseQrIdentifier("UTT:CARD:TTV001", "CARD"), "TTV001");
  assert.equal(parseQrIdentifier("UTT:BOOK:S001", "BOOK"), "S001");
  assert.equal(parseQrIdentifier("s_01", "BOOK"), "s_01");
});

test("rejects a QR for a different resource", () => {
  assert.throws(() => parseQrIdentifier("UTT:CARD:TTV001", "BOOK"), /loại/);
  assert.throws(() => parseQrIdentifier("UTT:LOAN:MT001", "CARD"), /loại/);
});

test("rejects empty, oversized, URL and unsafe identifiers", () => {
  for (const value of [null, "", "   ", "A".repeat(11), "https://example.com", "UTT:BOOK:", "S001:extra", "<script>", "S 001", "__proto__", "constructor"]) {
    assert.throws(() => parseQrIdentifier(value, "BOOK"));
  }
});
