import React, { useState, useRef, useEffect, type ReactNode } from "react";
import "./MultiSelect.css";

export interface Option<T> {
  value: T;
  label: string;
  color?: string;
}

export interface MultiSelectProps<T> {
  label: string;
  options: Option<T>[];
  selected: Set<T>;
  onChange: (selected: Set<T>) => void;
  renderOption?: (option: Option<T>, isSelected: boolean) => ReactNode;
  maxDisplayChips?: number;
  searchable?: boolean;
  selectAll?: boolean;
}

export function MultiSelect<T>({
  label,
  options,
  selected,
  onChange,
  renderOption,
  maxDisplayChips = 3,
  searchable = true,
  selectAll = true,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (value: T) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onChange(next);
  };

  const handleSelectAll = () => {
    if (selected.size === filteredOptions.length) {
      // deselect all currently filtered
      const next = new Set(selected);
      filteredOptions.forEach((opt) => next.delete(opt.value));
      onChange(next);
    } else {
      // select all currently filtered
      const next = new Set(selected);
      filteredOptions.forEach((opt) => next.add(opt.value));
      onChange(next);
    }
  };

  const selectedArray = Array.from(selected);
  const isAllSelected = filteredOptions.length > 0 && filteredOptions.every(opt => selected.has(opt.value));

  return (
    <div className="multiselect-container" ref={containerRef}>
      <div className="multiselect-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="multiselect-label">
          {label} {selected.size > 0 && <span className="multiselect-badge">{selected.size}</span>}
        </span>
        <svg
          className={`multiselect-chevron ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {searchable && (
            <div className="multiselect-search-container">
              <input
                type="text"
                className="multiselect-search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="multiselect-options">
            {selectAll && filteredOptions.length > 0 && (
              <div className="multiselect-option select-all" onClick={handleSelectAll}>
                <div className={`multiselect-checkbox ${isAllSelected ? "checked" : ""}`}>
                  {isAllSelected && <span className="multiselect-checkmark">✓</span>}
                </div>
                <span className="multiselect-option-label">
                  {isAllSelected ? "Deselect All" : "Select All"}
                </span>
              </div>
            )}

            {filteredOptions.length === 0 && (
              <div className="multiselect-no-results">No results found</div>
            )}

            {filteredOptions.map((opt, i) => {
              const isSelected = selected.has(opt.value);
              return (
                <div
                  key={i}
                  className={`multiselect-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleToggle(opt.value)}
                >
                  <div className={`multiselect-checkbox ${isSelected ? "checked" : ""}`}>
                    {isSelected && <span className="multiselect-checkmark">✓</span>}
                  </div>
                  {renderOption ? (
                    renderOption(opt, isSelected)
                  ) : (
                    <div className="multiselect-option-content">
                      {opt.color && (
                        <span
                          className="multiselect-color-dot"
                          style={{ backgroundColor: opt.color }}
                        />
                      )}
                      <span className="multiselect-option-label">{opt.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
