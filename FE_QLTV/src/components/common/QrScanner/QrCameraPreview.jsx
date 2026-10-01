import { useEffect, useRef, useState } from "react";
import { createCameraSession, getCameraErrorMessage } from "./cameraSession";

function QrCameraPreview({ onScan }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("starting");
  const [error, setError] = useState("");

  // Each mounted preview owns its stream and decoder, including late async results.
  // https://react.dev/reference/react/useEffect#connecting-to-an-external-system
  useEffect(() => {
    let active = true;
    let receivedResult = false;
    const session = createCameraSession();

    async function startCamera() {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (!active) return;
        if (!window.isSecureContext) {
          throw new Error("Camera cần HTTPS hoặc localhost. Bạn vẫn có thể nhập mã bên dưới.");
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Trình duyệt không hỗ trợ camera. Hãy dùng Chrome/Edge hoặc nhập mã bên dưới.");
        }
        const reader = new BrowserQRCodeReader();
        // Own getUserMedia so closing during permission/startup also releases tracks.
        // https://github.com/zxing-js/browser#scan-from-webcam
        const started = await session.start(
          videoRef.current,
          () => navigator.mediaDevices.getUserMedia({ audio: false, video: true }),
          (stream, video) => reader.decodeFromStream(stream, video, (result) => {
            if (!active || receivedResult || !result) return;
            receivedResult = true;
            session.stop();
            setStatus("paused");
            onScan(result.getText());
          }),
        );
        if (active && started && !receivedResult) setStatus("scanning");
      } catch (cameraError) {
        if (!active) return;
        setStatus("error");
        setError(cameraError.name === "Error" ? cameraError.message : getCameraErrorMessage(cameraError));
      }
    }

    startCamera();
    return () => {
      active = false;
      session.stop();
    };
  }, [onScan]);

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg bg-slate-950">
        <video aria-label="Hình ảnh camera quét QR" autoPlay className="aspect-video w-full object-contain" muted playsInline ref={videoRef} />
        {status !== "error" ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="aspect-square w-1/2 rounded-lg border-2 border-white/80" />
          </div>
        ) : null}
      </div>
      {error ? <p className="text-sm font-medium text-rose-700" role="alert">{error}</p> : (
        <p className="text-sm text-slate-600" role="status">
          {status === "starting" ? "Đang mở camera… Nếu được hỏi, hãy cho phép sử dụng camera." :
            status === "paused" ? "Đã đọc QR và tắt camera. Bấm Thử lại để quét mã khác." :
              "Đưa mã QR vào khung hình, giữ yên và đảm bảo đủ ánh sáng."}
        </p>
      )}
    </div>
  );
}

export default QrCameraPreview;
