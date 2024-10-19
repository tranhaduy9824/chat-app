import {
  faBell,
  faBellSlash,
  faImages,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faFileAlt,
  faSearch,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontIcon } from "../Icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { User } from "../../types/auth";
import Avatar from "../Avatar";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useTheme } from "../../context/ThemeContext";
import SearchMessage from "./SearchMessage";
import { PinMessages } from "../Modal/PinMessages";

function InfoChat({ recipientUser }: { recipientUser: User | null }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);

  const { onlineUsers, currentChat, toggleMuteChat, isChatMuted } =
    useContext(ChatContext)!;
  const { isDarkTheme } = useTheme();

  const handleToggleNotifications = () => {
    if (currentChat) {
      toggleMuteChat(currentChat._id);
    }
  };

  return (
    <>
      <div
        className={`h-100 p-3 ms-3 d-flex flex-column align-items-center ${
          isDarkTheme ? "text-light" : ""
        }`}
        style={{
          minWidth: "350px",
          borderRadius: "var(--border-radius)",
          backgroundColor: !isDarkTheme
            ? "var(--bg-cpn-light-gentle)"
            : "var(--bg-cpn-dark-gentle)",
          border: !isDarkTheme
            ? "2px solid var(--bg-cpn-light)"
            : "2px solid var(--bg-cpn-dark)",
        }}
      >
        {isSearchOpen ? (
          <SearchMessage onClose={() => setIsSearchOpen(false)} />
        ) : (
          <>
            <Avatar
              width={72}
              height={72}
              user={recipientUser}
              style={{
                boxShadow:
                  "rgba(194, 214, 255, 0.39) 0px 8px 24px, rgba(194, 214, 255, 0.39) 0px 16px 56px, rgba(194, 214, 255, 0.39) 0px 24px 80px",
              }}
            />
            <p className="fw-bold mt-2 mb-0" style={{ fontSize: "1.4rem" }}>
              {recipientUser?.fullname}
            </p>
            <span
              className={`small text-secondary mb-4 ${
                isDarkTheme ? "text-light" : ""
              }`}
            >
              {onlineUsers?.some((user) => user?.userId === recipientUser?._id)
                ? "Online"
                : "Offline"}
            </span>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Tippy
                content={
                  !isChatMuted(currentChat?._id || "")
                    ? "Tắt thông báo"
                    : "Bật thông báo"
                }
              >
                <div
                  className="icon-info-chat"
                  style={{
                    backgroundColor: isDarkTheme ? "#1a0424" : "#eeddf5",
                  }}
                  onClick={handleToggleNotifications}
                >
                  <FontAwesomeIcon
                    icon={
                      isChatMuted(currentChat?._id || "")
                        ? (faBellSlash as IconProp)
                        : (faBell as IconProp)
                    }
                    style={{
                      color: isDarkTheme ? "white" : "#97803d",
                    }}
                  />
                </div>
              </Tippy>
              <Tippy content="Tìm kiếm">
                <div
                  className="icon-info-chat"
                  style={{
                    backgroundColor: isDarkTheme ? "#1a0424" : "#eeddf5",
                  }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <FontAwesomeIcon
                    icon={faSearch as IconProp}
                    style={{
                      color: isDarkTheme ? "white" : "#97803d",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </Tippy>
            </div>
            <div className="item-info-chat w-100 mt-3 rounded-5 overflow-hidden">
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#00000075" : "#dee4ed",
                }}
                onClick={() => setIsPinOpen(true)}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#eaf1f5",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faThumbTack as IconProp}
                    style={{ color: isDarkTheme ? "white" : "#888fa0" }}
                  />
                </div>
                Xem tin nhắn đã ghim
              </div>
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#00000075" : "#dee4ed",
                }}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#eaf1f5",
                  }}
                >
                  <FontIcon
                    style={{
                      fill: "currentColor",
                      color: isDarkTheme ? "white" : "#888fa0",
                    }}
                  />
                </div>{" "}
                Chỉnh sửa biệt danh
              </div>
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#00000075" : "#dee4ed",
                }}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#eaf1f5",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faImages as IconProp}
                    style={{ color: isDarkTheme ? "white" : "#888fa0" }}
                  />
                </div>{" "}
                File phương tiện
              </div>
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#00000075" : "#dee4ed",
                }}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#eaf1f5",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFileAlt as IconProp}
                    style={{ color: isDarkTheme ? "white" : "#888fa0" }}
                  />
                </div>{" "}
                File
              </div>
            </div>
            <div className="item-info-chat w-100 mt-3 rounded-5 overflow-hidden">
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#17030378" : "#f5e0e0",
                }}
                onClick={handleToggleNotifications}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#f5eeed",
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      isChatMuted(currentChat?._id || "")
                        ? (faBellSlash as IconProp)
                        : (faBell as IconProp)
                    }
                    style={{ color: isDarkTheme ? "white" : "#c2a9aa" }}
                  />
                </div>{" "}
                {!isChatMuted(currentChat?._id || "")
                  ? "Tắt thông báo"
                  : "Bật thông báo"}
              </div>
              <div
                style={{
                  backgroundColor: isDarkTheme ? "#17030378" : "#f5e0e0",
                }}
              >
                <div
                  style={{
                    backgroundColor: isDarkTheme
                      ? "var(--bg-cpn-dark)"
                      : "#f5eeed",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBan as IconProp}
                    style={{ color: isDarkTheme ? "white" : "#c2a9aa" }}
                  />
                </div>{" "}
                Chặn
              </div>
            </div>
          </>
        )}
      </div>
      <PinMessages show={isPinOpen} onClose={() => setIsPinOpen(false)} recipientUser={recipientUser} />
    </>
  );
}

export default InfoChat;
