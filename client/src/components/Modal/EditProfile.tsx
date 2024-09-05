import React, { useContext, useEffect, useState } from "react";
import WrapperModal from "../WrapperModal";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../Avatar";
import { Button } from "react-bootstrap";

interface EditProfileProps {
  show: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ show, onClose }) => {
  const [avatar, setAvatar] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "");
      setFullname(user.fullname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <WrapperModal show={show} onClose={onClose}>
      <div className="p-2" style={{ width: "350px" }}>
        <h4>Edit Profile</h4>
        <form onSubmit={handleSubmit}>
          <div className="my-3 text-center">
            <label
              htmlFor="avatar-upload"
              className="d-block position-relative avatar-upload"
            >
              <Avatar user={user} width={150} height={150} />
              <input
                type="file"
                id="avatar-upload"
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                onChange={handleFileChange}
                accept="image/*"
              />
              <div
                className="position-absolute top-50 start-50 translate-middle text-center text-white bg-dark opacity-50 rounded-circle"
                style={{
                  width: "40px",
                  height: "40px",
                  lineHeight: "40px",
                  cursor: "pointer",
                  display: "none",
                }}
              >
                <span className="d-block">+</span>
              </div>
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">
              Fullname
            </label>
            <input
              type="text"
              id="fullname"
              className="form-control"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <Button
              variant="primary"
              type="submit"
              className="fw-bold"
              style={{
                border: "2px solid var(--primary-light)",
                backgroundColor: "white",
                color: "var(--text-dark)",
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </WrapperModal>
  );
};

export default EditProfile;
