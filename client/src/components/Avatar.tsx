import { User } from "../types/auth";

interface AvatarProps {
  user: User | null;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

function Avatar({ user, width = 50, height = 50, style }: AvatarProps) {
  return (
    <img
      src={`http://localhost:5000/${user?.avatar}`}
      alt={user?.fullname}
      className="rounded-circle mr-3"
      style={{ border: "1px solid var(--primary-light)", ...style }}
      width={width}
      height={height}
    />
  );
}

export default Avatar;
