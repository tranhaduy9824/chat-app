import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../context/NotificationContext";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const NotificationList = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.type === "error" && (
            <FontAwesomeIcon icon={faCircleXmark} />
          )}{" "}
          {notification.type === "info" && (
            <FontAwesomeIcon icon={faCircleExclamation} />
          )}{" "}
          {notification.type === "success" && (
            <FontAwesomeIcon icon={faCircleCheck} />
          )}{" "}
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
