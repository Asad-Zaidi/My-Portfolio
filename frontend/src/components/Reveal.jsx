import useReveal from "../hooks/useReveal";

/**
 * Generic fade-up-on-scroll wrapper for staggered card/list entrances.
 * `delay` is in milliseconds and only applied once the element is in view.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, inView] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-300 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
