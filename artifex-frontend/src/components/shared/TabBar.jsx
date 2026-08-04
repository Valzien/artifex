export function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
