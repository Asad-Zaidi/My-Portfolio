import { useState } from "react";

/**
 * Photo avatar with a graceful initials fallback — used everywhere a
 * profile image may not be provided by the portfolio API.
 */
export default function Avatar({ src, name = "", className = "", initials }) {
  const [failed, setFailed] = useState(false);
  const computedInitials =
    initials ||
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name ? `Portrait of ${name}` : "Profile photo"}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name ? `Portrait of ${name}` : "Profile photo placeholder"}
      className={`flex items-center justify-center bg-gradient-to-br from-accent to-blue-400 text-white font-bold ${className}`}
    >
      <span style={{ fontSize: "min(2.4rem, 32%)" }}>{computedInitials || "?"}</span>
    </div>
  );
}
