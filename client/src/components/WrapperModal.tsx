import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface WrapperModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const WrapperModal: React.FC<WrapperModalProps> = ({
  show,
  onClose,
  children,
}) => {
  const [showModal, setShowModal] = useState(show);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      className="position-fixed top-0 z-3 vw-100 vh-100 d-flex align-items-center justify-content-center"
      style={{
        visibility: show || showModal ? "visible" : "hidden",
        transition: "visibility 0.8s ease-in-out",
      }}
      onClick={handleClose}
    >
      <div
        className="position-relative p-3 bg-white rounded-3"
        style={{
          boxShadow:
            "var(--primary-light) 0px 8px 24px, var(--primary-light) 0px 16px 56px, var(--primary-light) 0px 24px 80px",
          transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
          transform: showModal ? "scale(1)" : "scale(0)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <span
          className="position-absolute"
          style={{
            top: "16px",
            right: "16px",
            cursor: "pointer",
            color: "rgb(234, 103, 164)",
          }}
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} style={{ fontSize: "22px" }} />
        </span>
      </div>
    </div>
  );
};

export default WrapperModal;