/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Search from "../Search";
import { ChatContext } from "../../context/ChatContext";
import { User } from "../../types/auth";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useTheme } from "../../context/ThemeContext";
import { MessageContext } from "../../context/MessageContext";
import { unReadNotificationsFunc } from "../../utils/unReadNotificationsFunc";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { searchUsers, user } = useContext(AuthContext)!;
  const { currentChat, createChat } = useContext(ChatContext)!;
  const { notifications, markThisUserNotificationsAsRead } =
    useContext(MessageContext)!;
  const debouncedQuery = useDebounce(query, 500);
  const { isDarkTheme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (debouncedQuery.trim()) {
      const response = await searchUsers(debouncedQuery, 1, 10);
      if (response) {
        setResults(response);
        setHasMore(response.length > 0);
        setPage(1);
      }
    }
  };

  const loadMoreResults = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const response = await searchUsers(debouncedQuery, nextPage, 10);
    if (response) {
      setResults((prev) => [...prev, ...response]);
      setHasMore(response.length > 0);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    return () => {
      setQuery("");
      setResults([]);
      setPage(1);
      setHasMore(true);
    };
  }, [currentChat]);

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ color: "rgb(234, 103, 164)" }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="d-flex flex-column w-100 h-100 position-relative">
      <Search
        className="px-0"
        placeholder="Tìm kiếm tin nhắn"
        value={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
        handleDelete={() => {
          setQuery("");
          setResults([]);
        }}
      />
      {results?.length > 0 && (
        <div
          className="flex-grow-1 overflow-auto position-absolute top-100 start-50 translate-middle-x z-2 px-3"
          style={{
            backgroundColor: !isDarkTheme
              ? "var(--bg-cpn-light)"
              : "var(--bg-cpn-dark)",
            width: "calc(100% + 32px)",
            height: "calc(580px - 100%)",
          }}
          onScroll={(e) => {
            const bottom =
              Math.ceil(
                e.currentTarget.scrollTop + e.currentTarget.clientHeight
              ) >= e.currentTarget.scrollHeight;
            if (bottom) loadMoreResults();
          }}
        >
          {results
            ?.filter((u) => u._id !== user?._id)
            ?.map((u) => {
              const unReadNotifications =
                unReadNotificationsFunc(notifications);
              const thisUserNotification = unReadNotifications?.filter(
                (n: any) => n.senderId === u?._id
              );
              return (
                <div
                  key={u._id}
                  className="d-flex py-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (user) {
                      createChat(user._id, u._id);
                    }
                    if (thisUserNotification?.length !== 0) {
                      markThisUserNotificationsAsRead(
                        thisUserNotification,
                        notifications
                      );
                    }
                  }}
                >
                  <Avatar user={u} width={50} height={50} />
                  <div className="ms-2">
                    <div className="message-sender fw-bold">
                      {highlightText(u.fullname, query)}
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="message-text">{u.email}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
