import { useEffect, useRef, useState } from "react";

/**
 * Tracks which section id is currently most visible in the viewport,
 * for driving the navbar's active-link indicator during scroll.
 */
export default function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState(ids[0]);
  const manualSelectionUntil = useRef(0);

  const selectSection = (id) => {
    setActive(id);
    manualSelectionUntil.current = performance.now() + 800;
  };

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const onScroll = () => {
      if (performance.now() < manualSelectionUntil.current) return;

      const scrollPos = window.scrollY + offset;
      let current = sections[0].id;
      let currentTop = sections[0].offsetTop;

      for (const section of sections) {
        const sectionTop = section.offsetTop;
        if (sectionTop <= scrollPos && sectionTop > currentTop) {
          current = section.id;
          currentTop = sectionTop;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        current = sections[sections.length - 1].id;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), offset]);

  return [active, selectSection];
}
