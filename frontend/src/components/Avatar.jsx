import { useState } from "react";
import Skeleton from "./ui/Skeleton";

/**
 * Photo avatar with lazy loading, skeleton shimmer, and graceful initials fallback.
 */
export default function Avatar({ src, name = "", className = "", initials }) {
  const [loaded, setLoaded] = useState(false);
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
      <div className={`relative overflow-hidden ${className}`}>
        {!loaded && (
          <Skeleton
            variant="rectangular"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <img
          src={src}
          alt={name ? `Portrait of ${name}` : "Profile photo"}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
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

