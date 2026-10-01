import JSZip from "jszip";

function getSafeIdentifier(identifier) {
  const safeIdentifier = String(identifier ?? "").trim().replace(/[^a-zA-Z0-9_-]/g, "_");

  if (!safeIdentifier) throw new Error("Mã QR không hợp lệ.");

  return safeIdentifier;
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function getQrPngFileName({ filePrefix, identifier }) {
  return `${filePrefix}-${getSafeIdentifier(identifier)}.png`;
}

export async function downloadQrPng({ fetchQrImage, filePrefix, identifier, qrImageUrl }) {
  if (!qrImageUrl) throw new Error("Bản ghi này chưa có ảnh QR.");

  const image = await fetchQrImage(qrImageUrl);
  const fileName = getQrPngFileName({ filePrefix, identifier });

  triggerDownload(image, fileName);
  return fileName;
}

export async function createQrZip({ filePrefix, identifierKey, rows, fetchQrImage }) {
  const zip = new JSZip();
  const exportedIdentifiers = [];
  const skippedIdentifiers = [];

  for (const row of rows) {
    const identifier = row[identifierKey];
    const qrImageUrl = row.QrImageUrl;

    if (!qrImageUrl) {
      skippedIdentifiers.push(String(identifier ?? "không xác định"));
      continue;
    }

    try {
      const image = await fetchQrImage(qrImageUrl);
      zip.file(getQrPngFileName({ filePrefix, identifier }), image);
      exportedIdentifiers.push(String(identifier));
    } catch {
      skippedIdentifiers.push(String(identifier ?? "không xác định"));
    }
  }

  if (!exportedIdentifiers.length) {
    throw new Error("Không có ảnh QR nào có thể xuất.");
  }

  return { exportedIdentifiers, skippedIdentifiers, zip };
}

export async function exportQrPngs({ fetchQrImage, filePrefix, identifierKey, rows, zipFileName }) {
  const result = await createQrZip({ filePrefix, identifierKey, rows, fetchQrImage });
  const archive = await result.zip.generateAsync({ type: "blob" });

  triggerDownload(archive, zipFileName);
  return result;
}
