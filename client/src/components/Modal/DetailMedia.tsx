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
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <img src={mediaDetail} alt="media" className="mh-100 w-auto" />
      </div>
    </WrapperModal>
  );
};
