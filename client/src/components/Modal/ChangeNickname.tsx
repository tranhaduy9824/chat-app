/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext, useRef } from "react";
import WrapperModal from "../WrapperModal";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../Avatar";
import fetchUser from "../../hooks/useFetchUser";
import { useTheme } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

interface ChangeNicknameProps {
  show: boolean;
  onClose: () => void;
}

export const ChangeNickname = ({ show, onClose }: ChangeNicknameProps) => {
  const [nicknames, setNicknames] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [originalNickname, setOriginalNickname] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  const { currentChat, updateNickname, setUserChats, userChats } =
    useContext(ChatContext)!;
  const { user } = useContext(AuthContext)!;
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const fetchMembers = async () => {
      if (currentChat) {
        const members = await Promise.all(
          currentChat.members.map(async (memberId: string) => {
            const member = await fetchUser(memberId);
            const chatNickname = currentChat.nicknames.find(
              (n) => n.userId === memberId
            )?.nickname;
            const memberWithNickname = {
              ...member,
              nickname: chatNickname || member?.fullname,
            };
            return memberWithNickname;
          })
        );
        setNicknames(members);
      }
    };

    fetchMembers();
  }, [currentChat]);

  const handleChange = (userId: string, newNickname: string) => {
    setNicknames((prev) =>
      prev.map((n) => (n._id === userId ? { ...n, nickname: newNickname } : n))
    );
  };

  const handleSubmit = async (userId: string) => {
    if (currentChat && user) {
      const nickname = nicknames.find((n) => n._id === userId)?.nickname;
      if (nickname) {
        setEditingUserId(null);
        setOriginalNickname(null);
        await updateNickname(currentChat._id, userId, nickname);

        const updatedNicknames = currentChat.nicknames.map((n) =>
          n.userId === userId ? { ...n, nickname } : n
        );

        const updatedChats = userChats?.map((chat) =>
          chat._id === currentChat._id
            ? { ...chat, nicknames: updatedNicknames }
            : chat
        );

        setUserChats(updatedChats || []);
      }
    }
  };

  const handleEditClick = (userId: string) => {
    setEditingUserId(userId);
    const originalNickname = nicknames.find((n) => n._id === userId)?.nickname;
    setOriginalNickname(originalNickname || null);
    inputRef.current?.focus();
  };

  const resetNicknameIfEmpty = (userId: string) => {
    setNicknames((prev) =>
      prev.map((n) =>
        n._id === userId && !n.nickname
          ? { ...n, nickname: originalNickname || n.fullname }
          : n
      )
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      checkRef.current &&
      !checkRef.current.contains(event.target as Node)
    ) {
      if (editingUserId) {
        resetNicknameIfEmpty(editingUserId);
      }
      setEditingUserId(null);
      setOriginalNickname(null);
    }
  };

  useEffect(() => {
    if (editingUserId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingUserId]);

  return (
    <WrapperModal show={show} onClose={onClose}>
      <div style={{ width: "500px", height: "max-content", overflowY: "auto" }}>
        <p className="text-center fw-bold mb-4 ">Biệt danh</p>
        {nicknames.map((u) => (
          <div key={u._id} className="mb-4 d-flex align-items-center px-2">
            <Avatar user={u} width={45} height={45} className="me-2" />
            <div className="flex-grow-1">
              {editingUserId === u._id ? (
                <div className="d-flex align-items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={u.nickname}
                    onChange={(e) => handleChange(u._id, e.target.value)}
                    className={`form-control ${
                      isDarkTheme ? "bg-dark text-light" : ""
                    }`}
                  />
                  <span
                    ref={checkRef}
                    className="ms-2 cursor-pointer"
                    onClick={() => handleSubmit(u._id)}
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: "20px" }}
                      icon={faCheck as IconProp}
                    />
                  </span>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="fw-bold">{u.nickname}</span>
                    <span className="small">{u.fullname}</span>
                  </div>
                  <span
                    className="ms-2 cursor-pointer"
                    onClick={() => handleEditClick(u._id)}
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: "20px" }}
                      icon={faEdit as IconProp}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </WrapperModal>
  );
};
