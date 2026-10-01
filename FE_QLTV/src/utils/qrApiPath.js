export function toApiClientPath(qrImageUrl) {
  return qrImageUrl.replace(/^\/api(?=\/)/, "");
}
