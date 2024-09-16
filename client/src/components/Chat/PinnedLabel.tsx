import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

interface PinnedLabelProps {
  senderId: string;
}

const PinnedLabel = ({ senderId }: PinnedLabelProps) => {
  const { user } = useContext(AuthContext)!;

  return (
    <span
      className={`d-block w-100 small ${
        senderId !== user?._id ? "ms-5" : "text-end pe-5"
      }`}
      style={{ minWidth: "max-content" }}
    >
      Đã ghim
    </span>
  );
};

export default PinnedLabel;
