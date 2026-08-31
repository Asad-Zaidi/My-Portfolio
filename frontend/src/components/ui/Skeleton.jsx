import { cn } from "../../lib/utils";

/**
 * Universal Skeleton Component
 * Provides a theme-aware animated placeholder matching light/dark mode design.
 *
 * @param {string} variant - 'text' | 'circular' | 'rounded' | 'rectangular' | 'card'
 * @param {boolean} shimmer - whether to render the running gradient highlight
 * @param {boolean} pulse - whether to add gentle opacity breathing animation
 */
export function Skeleton({
  className = "",
  variant = "rounded",
  shimmer = true,
  pulse = true,
  style = {},
  children,
  ...props
}) {
  const variantStyles = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full shrink-0",
    rounded: "rounded-xl",
    card: "rounded-2xl border border-slate-200/60 dark:border-navy-700/60",
    rectangular: "rounded-none",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-slate-200/90 dark:bg-navy-800/90 select-none",
        variantStyles[variant] || "rounded-xl",
        pulse && "skeleton-pulse",
        className
      )}
      style={style}
      {...props}
    >
      {shimmer && <div className="skeleton-shimmer-layer pointer-events-none" />}
      {children}
    </div>
  );
}

export default Skeleton;
