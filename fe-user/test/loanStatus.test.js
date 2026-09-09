import assert from "node:assert/strict";
import test from "node:test";

import { getLoanAlert } from "../src/utils/loanStatus.js";

test("marks an open overdue loan as danger", () => {
  assert.deepEqual(getLoanAlert({ NgayTra: null, SoNgayQuaHan: 4, SoNgayConLai: -4 }), {
    level: "danger",
    text: "Quá hạn 4 ngày",
  });
});

test("marks a loan due today as warning", () => {
  assert.deepEqual(getLoanAlert({ NgayTra: null, SoNgayQuaHan: 0, SoNgayConLai: 0 }), {
    level: "warning",
    text: "Hạn trả hôm nay",
  });
});
