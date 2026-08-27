import { useEffect, useRef, useState } from "react";
import { Medal, Award, Trophy, BadgeCheck, ShieldCheck, ExternalLink, X, Maximize2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const icons = [Award, BadgeCheck, Trophy, ShieldCheck, Medal];

const badgeEmbeds = {
  "badge-1": "9fb557b8-ea05-4942-a05b-8244458b4d21",
  "badge-2": "4bfa62cd-77a7-4637-b410-de0b0e4d7462",
  "badge-3": "ab79668f-f9fd-4380-87ad-8d61b5ca8e04",
};

function CredlyEmbed({ badgeId, title, eager = false }) {
  const embedRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || !embedRef.current || typeof IntersectionObserver === "undefined") {
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
      { rootMargin: "240px" }
    );
    observer.observe(embedRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!shouldLoad || !embedRef.current || !badgeId) return undefined;

    const container = embedRef.current;
    container.replaceChildren();
    const badge = document.createElement("div");
    badge.dataset.iframeWidth = "180";
    badge.dataset.iframeHeight = "324";
    badge.dataset.shareBadgeId = badgeId;
    badge.dataset.shareBadgeHost = "https://www.credly.com";
    container.appendChild(badge);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://cdn.credly.com/assets/utilities/embed.js";
    container.appendChild(script);

    const enforceSize = () => {
      const iframe = container.querySelector("iframe");
      if (!iframe) return;
      iframe.style.setProperty("width", "180px", "important");
      iframe.style.setProperty("height", "324px", "important");
      iframe.style.setProperty("display", "block", "important");
    };
    const observer = new MutationObserver(enforceSize);
    observer.observe(container, { childList: true, subtree: true });
    enforceSize();

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, [badgeId, shouldLoad]);

  return <div ref={embedRef} aria-label={`${title} Credly badge`} className="flex h-[324px] w-[180px] justify-center overflow-hidden" />;
}

export default function Badges({ items = [] }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (event) => event.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!items.length) return null;

  return (
    <section id="badges" className="bg-white dark:bg-navy-950 py-16 md:py-24">
      <div className="container">
        <SectionHeading icon={Medal} title="Course Badges" subtitle="Micro-credentials earned along the way" />

        <div className="flex flex-nowrap justify-start gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-3 md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {items.map((badge, index) => {
            const Icon = icons[index % icons.length];
            const embedId = badge.embedId || badgeEmbeds[badge.id];
            const content = (
              <>
                <div className="group relative flex h-[324px] w-[180px] items-center justify-center overflow-hidden rounded-lg transition-[filter] duration-200 group-hover:brightness-95">
                  {embedId ? (
                    <CredlyEmbed badgeId={embedId} title={badge.title} />
                  ) : (
                    <Icon className="h-10 w-10 text-accent" />
                  )}
                  {embedId && (
                    <button
                      type="button"
                      onClick={() => setPreview({ ...badge, embedId })}
                      aria-label={`Preview ${badge.title} badge`}
                      className="absolute inset-0 m-0 cursor-zoom-in border-0 bg-transparent p-0"
                    >
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <Maximize2 className="h-5 w-5 text-white  opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                    </button>
                  )}
                </div>
                
                {(badge.issuer || badge.date) && (
                  <span className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 text-center">
                    {[badge.issuer, badge.date].filter(Boolean).join(" · ")}
                  </span>
                )}
                
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
          aria-label={`${preview.title} badge preview`}
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
                  <CredlyEmbed badgeId={preview.embedId} title={preview.title} eager />
            </div>
            <a
              href={`https://www.credly.com/badges/${preview.embedId}/public_url`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-xs text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-white"
            >
              Provided by Credly
            </a>
            {(preview.credentialUrl || preview.embedId) && (
              <a
                href={preview.credentialUrl || `https://www.credly.com/badges/${preview.embedId}/public_url`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Verify Badge <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
