import useReveal from "../hooks/useReveal";

/**
 * Consistent section header: a small blue icon badge + title (+ optional
 * subtitle and trailing action). Used at the top of every content section.
 */
export default function SectionHeading({ icon: Icon, title, subtitle, action, align = "left" }) {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`flex flex-wrap items-start justify-between gap-4 mb-8 md:mb-12 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${align === "center" ? "flex-col items-center text-center" : ""}`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-card">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
        )}
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm md:text-base text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
