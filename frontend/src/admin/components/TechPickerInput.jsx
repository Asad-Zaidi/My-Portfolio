import { useState, useRef, useEffect } from "react";
import {
  LuPlus as Plus,
  LuX as X,
  LuChevronDown as ChevronDown,
  LuSearch as Search,
  LuCheck as Check,
  LuCode as Code,
} from "react-icons/lu";
import { techIcons, getTechIcon, TechIcon } from "../../components/Skills";

/**
 * TechPickerInput Component
 * Provides a text input with comma-separated values, quick-add dropdown with brand icons,
 * and live badge previews for matched technologies and tools.
 */
export default function TechPickerInput({
  label,
  value = "",
  onChange,
  placeholder = "e.g. React, Node.js, TypeScript",
  helpText,
  filterType = "all", // 'languages' | 'tools' | 'all'
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Parse items from comma-separated string
  const currentItems = (typeof value === "string" ? value : "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Toggle item in list
  const toggleItem = (name) => {
    const exists = currentItems.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );
    let updated;
    if (exists) {
      updated = currentItems.filter(
        (item) => item.toLowerCase() !== name.toLowerCase()
      );
    } else {
      updated = [...currentItems, name];
    }
    onChange(updated.join(", "));
  };

  // Remove single item
  const removeItem = (indexToRemove) => {
    const updated = currentItems.filter((_, idx) => idx !== indexToRemove);
    onChange(updated.join(", "));
  };

  // Filter available tech icons
  const filteredSuggestions = techIcons.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.label.toLowerCase().includes(q) ||
      t.key.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Select from list</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-2xl p-2 animate-fadeIn">
                {/* Search input in dropdown */}
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tech or tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-accent"
                    autoFocus
                  />
                </div>

                {/* Suggestions List */}
                <div className="max-h-56 overflow-y-auto space-y-0.5 scrollbar-thin">
                  {filteredSuggestions.length === 0 ? (
                    <div className="py-3 text-center text-xs text-slate-400">
                      No matching tech found
                    </div>
                  ) : (
                    filteredSuggestions.map((item) => {
                      const isSelected = currentItems.some(
                        (cur) => cur.toLowerCase() === item.label.toLowerCase() || cur.toLowerCase() === item.key.toLowerCase()
                      );

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleItem(item.label)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                            isSelected
                              ? "bg-accent/10 dark:bg-accent/20 text-accent font-semibold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-4 w-4 items-center justify-center">
                              <TechIcon tech={item} className="h-3.5 w-3.5" />
                            </span>
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text Input */}
      <input
        type="text"
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-navy-600 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {helpText && (
        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
          {helpText}
        </span>
      )}

      {/* Live Rendered Badges & Icons Preview */}
      {currentItems.length > 0 && (
        <div className="pt-1">
          <div className="flex flex-wrap gap-1.5">
            {currentItems.map((item, idx) => {
              const tech = getTechIcon(item);

              return (
                <span
                  key={`${item}-${idx}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800/90 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all"
                >
                  {tech ? (
                    <TechIcon tech={tech} className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Code className="h-3 w-3 text-accent shrink-0" />
                  )}
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="ml-0.5 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-navy-700 dark:hover:text-white transition-colors"
                    title={`Remove ${item}`}
                    aria-label={`Remove ${item}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
