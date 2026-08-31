import { useEffect, useRef, useState } from "react";
import {
  LuClipboardList as ClipboardList,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuAward as Award,
  LuExternalLink as ExternalLink,
  LuX as X,
  LuMaximize2 as Maximize2,
} from "react-icons/lu";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import LazyImage from "./ui/LazyImage";

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-cyan-600",
];

function CertImage({ item, index }) {
  if (item.image) {
    return (
      <LazyImage
        src={item.image}
        alt={item.title}
        containerClassName="h-full w-full"
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]}`}>
      <Award className="h-10 w-10 text-white/80" />
    </div>
  );
}

export default function Certifications({ items = [] }) {
  const railRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!items.length) return null;

  const scroll = (dir) => {
    railRef.current?.scrollBy({ left: dir * 320, behavior: "auto" });
  };

  return (
    <section id="certifications" className="-mx-8 bg-slate-50 px-8 py-8 dark:bg-navy-900 md:-mx-32 md:px-32 md:py-16">
      <div className="container">
        <SectionHeading
          icon={ClipboardList}
          title="Certifications & Courses"
          subtitle="Continuous learning, credential by credential"
          action={
            <div className="hidden sm:flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Scroll certifications left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-navy-700 text-slate-500 hover:bg-accent hover:text-white hover:border-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Scroll certifications right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-navy-700 text-slate-500 hover:bg-accent hover:text-white hover:border-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        />

        <div
          ref={railRef}
          className="flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none pb-3 -mx-1 px-1"
        >
          {items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 60}
              className="group snap-start shrink-0 w-64 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 shadow-card hover:shadow-card-hover overflow-hidden"
            >
              <button
                type="button"
                onClick={() => item.image && setPreview({ ...item })}
                  className={`relative block aspect-[5/4] w-full ${item.image ? "cursor-zoom-in" : "cursor-default"}`}
                  aria-label={item.image ? `Preview ${item.title} certificate` : item.title}
              >
                  <CertImage item={item} index={index} />
                  {item.image && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30">
                    <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                  </span>
                )}
              </button>

              <div className="p-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.provider}</span>
                  <span>{item.year}</span>
                </div>
                {item.description && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                )}
                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Verify Certificate <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.title} certificate preview`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={preview.image} alt={preview.title} className="w-full rounded-xl shadow-2xl" />
            <p className="mt-3 text-center text-white font-medium">{preview.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
