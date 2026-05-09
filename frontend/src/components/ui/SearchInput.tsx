/**
 * SearchInput — debounced search field with clear button and search icon.
 */

import { useRef } from "react";
import "./SearchInput.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
  id,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`search-input ${className}`}>
      <span className="search-input__icon">🔍</span>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="search-input__field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          className="search-input__clear"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
