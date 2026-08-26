import { Languages as LanguagesIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";

const ringColors = ["#2563eb", "#db2777", "#7c3aed", "#0891b2", "#d97706"];
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function LanguageRing({ name, level, percent, color }) {
  const [ref, inView] = useReveal();
  const offset = CIRCUMFERENCE * (1 - (inView ? percent : 0) / 100);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="8" className="stroke-slate-100 dark:stroke-navy-700" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-800 dark:text-white">{percent}%</span>
        </div>
      </div>
      <span className="mt-3 font-semibold text-slate-800 dark:text-white">{name}</span>
      {level && <span className="text-xs text-slate-400 dark:text-slate-500">({level})</span>}
    </div>
  );
}

export default function Languages({ items = [], embedded = false }) {
  if (!items.length) return null;

  return (
    <section id="languages" className={`${embedded ? "" : "bg-white dark:bg-navy-950"} py-16 md:py-24`}>
      <div className={embedded ? "" : "container"}>
        <SectionHeading icon={LanguagesIcon} title="Languages" subtitle="Comfortable communicating in" align="center" />

        <div className="flex flex-wrap justify-center gap-10 sm:gap-14">
          {items.map((lang, index) => (
            <Reveal key={lang.name} delay={index * 100}>
              <LanguageRing {...lang} color={ringColors[index % ringColors.length]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
