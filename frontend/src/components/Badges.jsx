import { useEffect, useRef, useState } from "react";
import { Medal, X, Maximize2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function BadgeEmbed({ embedCode, title, eager = false }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || !containerRef.current || typeof IntersectionObserver === "undefined") {
      if (!eager && typeof IntersectionObserver === "undefined") setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!shouldLoad || !containerRef.current || !embedCode) return undefined;

    const container = containerRef.current;
    const parsed = new DOMParser().parseFromString(embedCode, "text/html");
    const scripts = [];

    Array.from(parsed.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "script") {
        const source = node.getAttribute("src")?.replace(/^\/\//, "https://");
        if (!source || !source.startsWith("https://")) return;

        const script = document.createElement("script");
        script.src = source;
        script.async = node.hasAttribute("async");
        scripts.push(script);
        container.appendChild(script);
        return;
      }

      container.appendChild(document.importNode(node, true));
    });

    return () => {
      scripts.forEach((script) => script.remove());
      container.replaceChildren();
    };
  }, [embedCode, shouldLoad]);

  return (
    <div ref={containerRef} aria-label={title || "Embedded badge"} className="flex h-[324px] w-[180px] items-center justify-center overflow-hidden">
      {shouldLoad ? (
        null
      ) : (
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-label="Loading badge" />
      )}
    </div>
  );
}

export default function Badges({ items = [] }) {
  const [preview, setPreview] = useState(null);
  const embeddedBadges = items.filter((badge) => badge.embedCode?.trim());

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (event) => event.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!embeddedBadges.length) return null;

  return (
    <section id="badges" className="bg-white dark:bg-navy-950 py-16 md:py-24">
      <div className="container">
        <SectionHeading icon={Medal} title="Course Badges" subtitle="Micro-credentials earned along the way" />

        <div className="flex flex-nowrap justify-start gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-3 md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {embeddedBadges.map((badge, index) => {
            const content = (
              <>
                <div className="group relative flex h-[324px] w-[180px] items-center justify-center overflow-hidden rounded-lg transition-[filter] duration-200 group-hover:brightness-95">
                  <BadgeEmbed embedCode={badge.embedCode} title="Embedded badge" />
                  <button
                    type="button"
                    onClick={() => setPreview({ ...badge })}
                    aria-label="Preview embedded badge"
                    className="absolute inset-0 m-0 cursor-zoom-in border-0 bg-transparent p-0"
                  >
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <Maximize2 className="h-5 w-5 text-white  opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </button>
                </div>
              </>
            );

            const className =
              "flex h-[360px] w-48 flex-col items-center";

            return (
              <Reveal key={badge.id} delay={index * 60} className="shrink-0 snap-start">
                <div className={className}>{content}</div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Embedded badge preview"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 p-6 backdrop-blur-md motion-safe:animate-fade-in dark:bg-black/70"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/10 text-slate-700 hover:bg-slate-900/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex justify-center bg-white/60 dark:bg-white/5">
              <BadgeEmbed embedCode={preview.embedCode} title="Embedded badge" eager />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
