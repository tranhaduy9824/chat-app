/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { unReadNotificationsFunc } from "../utils/unReadNotificationsFunc";
import moment from "moment";
import { MessageContext } from "../context/MessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user } = useContext(AuthContext)!;
  const { userChats, allUsers } = useContext(ChatContext)!;
  const { notifications, markAllNotificationsAsRead, martNotificationAsRead } =
    useContext(MessageContext)!;

  const unReadNotifications = unReadNotificationsFunc(notifications);
  const modifiedNotifications: any = notifications?.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.fullname,
    };
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  return (
    <div className="position-relative" ref={notificationRef}>
      <div
        className="position-relative me-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon
          icon={faBell}
          style={{ fontSize: "20px", cursor: "pointer" }}
        />
        {notifications?.length === 0 ? null : (
          <span className="badge bg-success rounded-circle position-absolute top-0 start-100 translate-middle">
            {unReadNotifications?.length | 0}
          </span>
        )}
      </div>
      {isOpen && (
        <div
          className="bg-white position-absolute top-100 end-0 p-3 rounded-4 z-3"
          style={{
            maxHeight: "50vh",
            width: "300px",
            overflowY: "auto",
            boxShadow:
              "var(--primary-light) 0px 8px 24px, var(--primary-light) 0px 16px 56px, var(--primary-light) 0px 24px 80px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Notifications</h5>
            <div
              className="small"
              style={{ cursor: "pointer", color: "rgb(234, 103, 164)" }}
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          <hr className="text-secondary" />
          {modifiedNotifications?.length === 0 || !modifiedNotifications ? (
            <span>No notifications yet...</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n: any, index: number) => (
              <div
                key={index}
                className={`p-2 my-2 border-bottom ${
                  n.isRead ? "" : "bg-primary bg-opacity-10"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  martNotificationAsRead(n, userChats, user, notifications);
                  setIsOpen(false);
                }}
              >
                <span>
                  <span className="fw-bold">{n.senderName}</span> send you a new
                  message
                </span>
                <span className="text-secondary small ms-2">
                  {moment(n.date).calendar()}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
