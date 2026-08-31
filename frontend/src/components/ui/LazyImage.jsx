import { useState } from "react";
import { Skeleton } from "./Skeleton";
import { cn } from "../../lib/utils";

/**
 * LazyImage Component
 * Displays a theme-consistent skeleton shimmer until image loads, then transitions smoothly.
 */
export function LazyImage({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  skeletonClassName = "",
  fallback = null,
  eager = false,
  onLoad,
  onError,
  style = {},
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setError(true);
    setLoaded(true);
    if (onError) onError(e);
  };

  if (!src || error) {
    if (fallback) return fallback;
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-slate-100 dark:bg-navy-900 text-slate-400 dark:text-slate-500",
          containerClassName
        )}
      >
        <span className="text-xs">No image available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton placeholder shown until loaded */}
      {!loaded && (
        <Skeleton
          className={cn("absolute inset-0 h-full w-full", skeletonClassName)}
        />
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          className,
          "transition-all duration-500 ease-out",
          loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[0.98] blur-[2px]"
        )}
        style={style}
        {...props}
      />
    </div>
  );
}

export default LazyImage;
