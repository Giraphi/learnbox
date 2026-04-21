"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PoolMode = "current" | "all" | "failed-today";

type PoolOption = {
  value: PoolMode;
  label: string;
};

const POOL_OPTIONS: PoolOption[] = [
  { value: "current", label: "Current pool" },
  { value: "all", label: "All time" },
  { value: "failed-today", label: "Failed today" },
];

type PoolModeSelectorProps = {
  value: PoolMode;
  onChange: (value: PoolMode) => void;
};

export default function PoolModeSelector({
  value,
  onChange,
}: PoolModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const currentLabel =
    POOL_OPTIONS.find((option) => option.value === value)?.label ?? "";

  function handleSelect(mode: PoolMode) {
    onChange(mode);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:bg-foreground/10 active:bg-foreground/15"
      >
        <span className="text-foreground/40">Include:</span>
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn(
            "size-3 transition-transform",
            isOpen && "rotate-180",
          )}
          strokeWidth={2.5}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute bottom-full left-1/2 z-40 mb-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-foreground/15 bg-background shadow-lg"
        >
          {POOL_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-foreground/5 active:bg-foreground/10",
                  isSelected ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="size-3.5 text-emerald-500" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
