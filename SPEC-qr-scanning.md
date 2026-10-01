# QR scanning for loan creation

Status: approved in chat on 2026-10-01.

## Objective and scope

Staff use their laptop webcam to select a library-card owner and add books to a
loan in FE_QLTV. Each successful scan closes the scanner and releases the camera.
Opening the scanner again allows another deliberate scan, including an additional
copy of the same book. Existing manual selection, API validation, and borrowing
rules remain authoritative. No database changes, QR generation/printing, reader
portal changes, or return-flow changes are included.

## Stack and structure

React 19.2.7 / Vite 8.1.0 (package.json ranges), Tailwind 4, Radix dialog,
@zxing/browser (resolved version recorded in package-lock.json).

- src/components/common/QrScanner/: shared scanner UI and camera lifecycle.
- src/views/muontra/: card/book integration and domain helpers.
- src/utils/qrCode.js: payload validation.
- test/: permanent Node test-runner regression tests.

## Success criteria

- Accept raw identifiers and UTT:CARD:<MaThe> / UTT:BOOK:<MaSach>; reject wrong
  types, malformed data, URLs, oversized input, and missing records.
- A valid card selects its reader only when the scanned card is active and the
  reader satisfies the existing borrowing checks. Edit mode cannot change readers.
- A valid book adds one copy; a new deliberate scan increments the quantity up to
  available stock (plus already-borrowed copies when editing).
- Repeated camera frames do not add multiple copies.
- Camera access begins only after opening the scanner. Closing, Escape, successful
  scans, startup failures, unmount, and late permission responses release tracks.
- Permission denial, missing/busy camera, unsupported browser, and insecure origin
  show actionable messages. Manual input remains usable.
- UI follows current orange/slate styling, fits small screens, has accessible
  labels and status/error announcements, and supports keyboard interaction.

## Commands and verification

Run inside FE_QLTV (use npm.cmd on Windows PowerShell):

- npm test: node --test test/*.test.js (added for this feature).
- npm run lint
- npm run build
- npm run dev -- --host 127.0.0.1

Unit tests cover payloads, eligibility, quantity limits and camera cleanup races.
Browser checks use local fixtures, verify actual ZXing decoding where tooling
allows, and distinguish simulated video from a physical laptop camera.

## Style and boundaries

Follow existing JSX, named helpers, two-space indentation and local state:

```js
const cardId = parseQrIdentifier(value, "CARD");
const readerId = resolveScannedReader(cardId, libraryCards, readerOptions, today);
```

Always validate scanned input and clean up camera resources. Ask before schema,
API, permission or scope changes. Never embed credentials in QR data, upload
camera frames, or alter unrelated work.

## Sources

- https://github.com/zxing-js/browser#scan-from-webcam
- https://react.dev/reference/react/useEffect#connecting-to-an-external-system
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop

## Open questions

None for the approved scope.

## Verification result (2026-10-01)

- 14 permanent tests pass; frontend lint/build and git diff --check pass.
- Actual ZXing decoding of generated QR video via a simulated MediaStream selects
  cards/books. Each session stops its tracks; separate scans increment stock up to
  two copies, and further scans/out-of-stock books are rejected.
- Browser checks reject expired cards, readers with open loans, and wrong QR types;
  manual Enter input preserves the parent form. Escape stops a live preview and
  restores trigger focus. Scanner layout fits 320px and desktop viewports.
- A fixture-backed form save receives MaDG=DG001 and ChiTiet=[{MaSach:S001,
  SoLuong:2}]. This checks frontend integration, not a real backend/database write.
- Temporary local harness and isolated browser tabs removed; test dev server stopped.
- Physical laptop webcam and production backend were not exercised. Existing large
  bundle warnings remain; npm reported 16 dependency advisories on installation.
  The parent loan dialog also retains its existing initial-focus aria-hidden warning.
