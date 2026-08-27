import { useEffect, useRef, useState } from "react";

/**
 * Reveals its target once it scrolls into the viewport.
 * Returns a ref to attach and a boolean flag to drive entrance classes.
 * Fires only once so re-scrolling past a section doesn't replay the animation.
 */
export default function useReveal(options = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -20px 0px" } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
