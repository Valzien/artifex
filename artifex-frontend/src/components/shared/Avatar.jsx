function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

export function Avatar({ src, name, className = "h-10 w-10 text-sm" }) {
  if (isAvatarUrl(src)) {
    return (
      <img src={src} alt={name || "avatar"} className={`${className} rounded-full object-cover`} />
    );
  }
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${className}`}>
      {src || name?.[0] || "U"}
    </div>
  );
}
