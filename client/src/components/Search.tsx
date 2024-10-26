/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";
import { useTheme } from "../context/ThemeContext";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

interface SearchProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  handleDelete?: any;
}

const Search: React.FC<SearchProps> = ({
  className,
  placeholder,
  value,
  onChange,
  onSearch,
  handleDelete,
}) => {
  const { isDarkTheme } = useTheme();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={classNames("w-100 mb-3 position-relative", className)}>
      <input
        type="text"
        className={`form-control rounded-pill fw-bold ${
          isDarkTheme ? "bg-dark text-light" : ""
        }`}
        placeholder={placeholder || "Tìm kiếm"}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        style={{
          backgroundColor: !isDarkTheme
            ? "var(--bg-cpn-light-gentle)"
            : "var(--bg-cpn-dark-gentle)",
          padding: handleDelete ? "8px 85px 8px 12px" : "8px 50px 8px 12px",
          border: `1px solid ${isDarkTheme ? "#dee2e6" : "#b0b3b8"}`,
        }}
      />
      {value && handleDelete && (
        <FontAwesomeIcon
          icon={faTimesCircle as IconProp}
          onClick={handleDelete}
          className="position-absolute top-50 m-2"
          style={{
            right: "50px",
            cursor: "pointer",
            transform: "translateY(-100%)",
          }}
        />
      )}
      <div
        className={`d-flex align-items-center justify-content-center rounded-circle ml-2 position-absolute top-0 h-100 ${
          isDarkTheme ? "bg-dark text-light" : ""
        }`}
        style={{
          width: "auto",
          aspectRatio: "1/1",
          right: "0",
          border: `1px solid ${isDarkTheme ? "#dee2e6" : "#b0b3b8"}`,
          backgroundColor: "#e9ecf5",
          cursor: "pointer",
        }}
        onClick={onSearch}
      >
        <FontAwesomeIcon icon={faSearch as IconProp} />
      </div>
    </div>
  );
};

export default Search;
