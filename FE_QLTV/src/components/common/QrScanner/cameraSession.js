// Explicit ownership lets us release a stream even if permission arrives after close.
// https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
export function createCameraSession() {
  let stopped = false;
  let stream;
  let controls;
  let video;

  function stop() {
    stopped = true;
    try {
      controls?.stop();
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
      if (video) video.srcObject = null;
      controls = null;
      stream = null;
    }
  }

  async function start(preview, acquireStream, decodeStream) {
    if (stopped) return false;
    video = preview;
    try {
      const acquiredStream = await acquireStream();
      if (stopped) {
        acquiredStream.getTracks().forEach((track) => track.stop());
        return false;
      }
      stream = acquiredStream;
      const decoderControls = await decodeStream(stream, video);
      if (stopped) {
        decoderControls.stop();
        return false;
      }
      controls = decoderControls;
      return true;
    } catch (error) {
      stop();
      throw error;
    }
  }

  return { start, stop };
}

export function getCameraErrorMessage(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Quyền camera bị chặn. Hãy cho phép camera trong cài đặt trình duyệt, rồi thử lại hoặc nhập mã bên dưới.";
    case "NotFoundError":
      return "Không tìm thấy camera. Hãy kết nối webcam hoặc nhập mã bên dưới.";
    case "NotReadableError":
    case "AbortError":
      return "Không thể mở camera. Hãy đóng ứng dụng đang dùng webcam rồi thử lại.";
    default:
      return "Không thể khởi động quét QR. Hãy thử lại hoặc nhập mã bên dưới.";
  }
}
