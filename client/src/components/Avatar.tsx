import { User } from "../types/auth";
import avatarDefault from "../assets/avatar_default.png";

interface AvatarProps {
  user: User | null;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

function Avatar({
  user,
  width = 50,
  height = 50,
  style,
  className,
}: AvatarProps) {
  return (
    <img
      src={
        user?.avatar
          ? `https://chat-app-zqoj.onrender.com/${user?.avatar}`
          : avatarDefault
      }
      alt={user?.fullname}
      className={`rounded-circle mr-3 ${className}`}
      style={{ border: "1px solid var(--bg-primary-gentle)", ...style }}
      width={width}
      height={height}
    />
  );
}

export default Avatar;
