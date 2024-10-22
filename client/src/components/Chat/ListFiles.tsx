/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatFileSize } from "../../utils/format";
import { faFileText } from "@fortawesome/free-regular-svg-icons";
import { useTheme } from "../../context/ThemeContext";

interface ListFilesProps {
  listFiles: string;
  onClose: () => void;
  setListFiles: (value: string) => void;
}

export const ListFiles = ({
  listFiles,
  onClose,
  setListFiles,
}: ListFilesProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFileElementRef = useRef<any | null>(null);

  const { isDarkTheme } = useTheme();
  const { searchMessages } = useContext(MessageContext)!;

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await searchMessages("", page, 20, listFiles as any);
      console.log("Search Results:", response, page);
      if (response) {
        setFiles((prevFiles) => {
          const newFiles = response.messages.filter(
            (newFile) => !prevFiles.some((file) => file._id === newFile._id)
          );
          return [...prevFiles, ...newFiles];
        });
        setHasMore(response.hasMore);
      }
    };

    fetchFiles();

    return () => {
      setFiles([]);
    };
  }, [listFiles, page, searchMessages]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastFileElementRef.current) {
      observer.current.observe(lastFileElementRef.current);
    }
  }, [files, hasMore]);

  return (
    <div className="d-flex flex-column w-100 h-100">
      <div className="d-flex align-items-center mb-3">
        <button onClick={onClose} className="btn btn-link p-0 me-3">
          <FontAwesomeIcon icon={faArrowLeft as IconProp} size="lg" />
        </button>
        <div className="fw-bold">File phương tiện và file</div>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="w-50 text-center py-2 rounded-4"
          style={{
            backgroundColor:
              listFiles === "media"
                ? isDarkTheme
                  ? "var(--bg-cpn-dark)"
                  : "var(--bg-cpn-light)"
                : "",
            cursor: "pointer",
          }}
          onClick={() => {
            setListFiles("media");
            setFiles([]);
            setPage(1);
          }}
        >
          File phương tiện
        </div>
        <div
          className="w-50 text-center py-2 rounded-4"
          style={{
            backgroundColor:
              listFiles === "file"
                ? isDarkTheme
                  ? "var(--bg-cpn-dark)"
                  : "var(--bg-cpn-light)"
                : "",
            cursor: "pointer",
          }}
          onClick={() => {
            setListFiles("file");
            setFiles([]);
            setPage(1);
          }}
        >
          File
        </div>
      </div>
      {listFiles === "media" ? (
        <div className="file-grid mt-3">
          {files.map((file, index) => (
            <div
              key={file._id}
              className="file-item"
              ref={index === files.length - 1 ? lastFileElementRef : null}
            >
              <div className="file-item-content">
                {file.type === "image" ? (
                  <img src={file.mediaUrl} alt={file.text} />
                ) : file.type === "video" ? (
                  <video controls>
                    <source src={file.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="file-list mt-3">
          {files.map(
            (file, index) =>
              file.infoFile.name && (
                <a
                  ref={index === files.length - 1 ? lastFileElementRef : null}
                  key={file._id}
                  href={file.mediaUrl}
                  download={file.infoFile.name}
                  className={`text-decoration-none d-flex align-items-center ${
                    isDarkTheme ? "text-light" : "text-black"
                  }`}
                >
                  <span
                    className="me-3 rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      minWidth: "50px",
                      height: "50px",
                      backgroundColor: isDarkTheme
                        ? "var(--bg-cpn-dark)"
                        : "var(--bg-cpn-light)",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFileText as IconProp}
                      style={{ fontSize: "20px" }}
                    />
                  </span>
                  <div className="d-flex flex-column">
                    <span className="fw-bold">{file.infoFile.name}</span>
                    <span className="small">
                      {formatFileSize(file.infoFile.size)}
                    </span>
                  </div>
                </a>
              )
          )}
        </div>
      )}
    </div>
  );
};
