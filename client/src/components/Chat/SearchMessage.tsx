import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Search from "../Search";
import { MessageContext } from "../../context/MessageContext";
import { ChatContext } from "../../context/ChatContext";
import moment from "moment";
import fetchUser from "../../hooks/useFetchUser";
import { User } from "../../types/auth";
import Avatar from "../Avatar";
import { formatLength } from "../../utils/format";

interface SearchMessageProps {
  onClose: () => void;
}

const SearchMessage: React.FC<SearchMessageProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});

  const { searchMessages } = useContext(MessageContext)!;
  const { currentChat } = useContext(ChatContext)!;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim()) {
      const response = await searchMessages(query, 1, 10);
      if (response) {
        setResults(response.messages);
        setHasMore(response.hasMore);
        setPage(1);
      }
    }
  };

  const loadMoreResults = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const response = await searchMessages(query, nextPage, 10);
    if (response) {
      setResults((prev) => [...prev, ...response.messages]);
      setHasMore(response.hasMore);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    return () => {
      setQuery("");
      setResults([]);
      setPage(1);
      setHasMore(true);
    };
  }, [currentChat]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = Array.from(
        new Set(results.map((message) => message.senderId))
      );

      const userPromises = userIds.map((userId) => fetchUser(userId));
      const userResponses = await Promise.all(userPromises);
      const userMap = userResponses.reduce((acc, user, index) => {
        acc[userIds[index]] = user;
        return acc;
      }, {} as { [key: string]: User | null });
      setUsers(userMap);
    };

    if (results.length > 0) {
      fetchUsers();
    }
  }, [results]);

  useEffect(() => {
    if (query === "") {
      setResults([]);
    }
  }, [query]);

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
    <div className="d-flex flex-column w-100 h-100">
      <div className="d-flex align-items-center mb-3">
        <button onClick={onClose} className="btn btn-link p-0 me-3">
          <FontAwesomeIcon icon={faArrowLeft as IconProp} size="lg" />
        </button>
        <div className="fw-bold">Tìm kiếm</div>
      </div>
      <Search
        className="px-0"
        placeholder="Tìm kiếm tin nhắn"
        value={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
      />
      <div
        className="flex-grow-1 overflow-auto"
        onScroll={(e) => {
          const bottom =
            Math.ceil(
              e.currentTarget.scrollTop + e.currentTarget.clientHeight
            ) >= e.currentTarget.scrollHeight;
          if (bottom) loadMoreResults();
        }}
      >
        {results.map((message, index) => {
          const user = users[message.senderId];
          const isLastMessage = index === results.length - 1;

          return (
            <div
              key={message._id}
              className={`d-flex py-2 ${!isLastMessage ? "border-bottom" : ""}`}
            >
              <Avatar user={user} width={50} height={50} />
              <div className="ms-2">
                <div className="message-sender fw-bold">{user?.fullname}</div>
                <div className="d-flex align-items-center">
                  <div className="message-text">
                    {highlightText(formatLength(message.text, 20), query)}
                  </div>
                  <span className="mx-2">-</span>
                  <div className="message-timestamp small">
                    {moment(message.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchMessage;
