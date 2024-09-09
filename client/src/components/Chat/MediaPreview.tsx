import { faFileText } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";

interface MediaPreviewProps {
  mediaPreview: string;
  type: "image" | "video" | "file";
}

function MediaPreview({ mediaPreview, type }: MediaPreviewProps) {
  const { user } = useContext(AuthContext)!;

  return (
    <div>
      <div className="position-relative item-message d-flex align-items-start justify-content-end">
        <div
          className="d-flex align-items-center bg-white message position-relative"
          style={{
            maxWidth: "75%",
            borderRadius: "50px 50px 0 50px ",
            border: type === "file" ? "1px solid #ea67a4" : "",
            padding: type === "file" ? "8px" : "",
          }}
        >
          {type === "image" ? (
            <img
              src={mediaPreview}
              alt="media"
              style={{
                maxWidth: "280px",
                maxHeight: "300px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          ) : type === "video" ? (
            <video
              src={mediaPreview}
              controls
              style={{
                maxWidth: "280px",
                maxHeight: "300px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          ) : type === "file" ? (
            <a
              href={mediaPreview}
              download
              className="text-decoration-none text-black d-flex align-items-center"
              style={{ opacity: 0.5 }}
            >
              <span className="mx-2">
                <FontAwesomeIcon
                  icon={faFileText}
                  style={{ fontSize: "20px" }}
                />
              </span>
              <div className="d-flex flex-column">
                <span className="fw-bold">Tải về tập tin</span>
                <span className="small">1.8 KB</span>
              </div>
            </a>
          ) : null}
        </div>
        <div
          className="d-flex align-items-end ms-2 mt-auto"
          style={{ width: "35px", height: "100%" }}
        >
          <Avatar user={user} width={35} height={35} />
        </div>
      </div>
    </div>
  );
}

export default MediaPreview;
