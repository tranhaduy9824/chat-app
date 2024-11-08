import { useContext } from "react";
import { MessageContext } from "../../context/MessageContext";
import WrapperModal from "../WrapperModal";

export const DetailMedia = () => {
  const { mediaDetail, setMediaDetail } = useContext(MessageContext)!;

  return (
    <WrapperModal
      show={mediaDetail}
      onClose={() => setTimeout(() => setMediaDetail(null), 500)}
      className="w-100 h-100"
    >
      <div className="d-flex align-items-center justify-content-center h-100 w-100 position-relative">
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "-20px",
            width: "calc(100% + 40px)",
            height: "calc(100% + 40px)",
            backgroundImage: `url("${mediaDetail}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -1,
            scale: 1.4,
            opacity: 0.8,
            filter: "blur(10px)",
          }}
        ></div>
        <img src={mediaDetail} alt="media" className="mh-100 w-auto" />
      </div>
    </WrapperModal>
  );
};
