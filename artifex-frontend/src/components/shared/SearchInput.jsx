import { Search, X } from "lucide-react";

export function SearchInput({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors backdrop-blur-xl placeholder:text-ink/40 focus:border-primary"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
