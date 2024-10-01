/* eslint-disable react-hooks/exhaustive-deps */
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faTimes,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  setMediaPreview: (preview: string) => void;
}

function Camera({ onCapture, onClose, setMediaPreview }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleCapturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const stream = videoRef.current.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();

        canvasRef.current.width = settings.width || videoRef.current.videoWidth;
        canvasRef.current.height =
          settings.height || videoRef.current.videoHeight;

        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleSendPhoto = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_photo.png", {
            type: "image/png",
          });
          onCapture(file);
          setMediaPreview(capturedPhoto!);
        }
      });
    }
  };

  const handleStartCamera = async () => {
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      } catch (error) {
        console.error("Lỗi khi bắt đầu luồng video:", error);
      }
    }
  };

  useEffect(() => {
    handleStartCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!capturedPhoto) {
      handleStartCamera();
    }
  }, [capturedPhoto]);

  return (
    <div className="camera-container">
      {capturedPhoto ? (
        <>
          <img
            src={capturedPhoto}
            alt="Captured"
            style={{ height: "100%" }}
            className="p-3 bg-white rounded-3 mb-3"
          />
          <div
            className="d-flex align-items-center gap-2 position-absolute"
            style={{ bottom: "130px" }}
          >
            <button
              className="control-btn"
              onClick={() => {
                setCapturedPhoto(null);
                console.log("Đang khởi động lại camera");
              }}
            >
              <FontAwesomeIcon icon={faUndoAlt as IconProp} />
            </button>
            <button
              className="control-btn bg-primary-subtle"
              onClick={handleSendPhoto}
            >
              <FontAwesomeIcon icon={faPaperPlane as IconProp} />
            </button>
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            style={{ width: "max-content" }}
            autoPlay
            className="p-3 bg-white rounded-3 h-100 mb-3"
          ></video>
          <button
            className="control-btn position-absolute"
            style={{ bottom: "130px" }}
            onClick={handleCapturePhoto}
          >
            <FontAwesomeIcon icon={faCamera as IconProp} />
          </button>
        </>
      )}
      <button className="bg-danger-subtle control-btn" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes as IconProp} />
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default Camera;
