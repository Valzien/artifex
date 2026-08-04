import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ value, onChange, options, placeholder = "Pilih...", label }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1 block text-sm font-medium text-ink">{label}</label>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink transition-colors hover:border-primary/40 focus:border-primary focus:outline-none"
      >
        <span className={selected ? "text-ink" : "text-ink/40"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-surface py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface ${
                value === option.value ? "bg-surface font-medium text-primary" : "text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
