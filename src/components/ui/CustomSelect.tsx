"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  icon,
  disabled = false,
  className = "",
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={`ios-input text-xs flex items-center justify-between text-left transition-all ${
          icon ? "!pl-11 !pr-8" : "!px-2.5 !pr-7"
        } ${
          disabled
            ? "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed border-[#e2e8f0]"
            : "bg-white text-[#0f172a] cursor-pointer"
        } ${isOpen ? "ring-2 ring-[#0B4DB8]/20 border-[#0B4DB8]" : ""}`}
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
            {icon}
          </div>
        )}
        <span className={selected ? "text-[#0f172a] font-medium truncate" : "text-[#94a3b8] truncate"}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#64748b]">
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#0B4DB8]" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-full bg-white rounded-lg border border-[#e2e8f0] shadow-xl max-h-56 overflow-y-auto p-1 divide-y divide-slate-50 overscroll-contain"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#0B4DB8] text-white font-semibold"
                      : "text-[#0f172a] hover:bg-[#f1f5f9] active:bg-[#eef4fb]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

