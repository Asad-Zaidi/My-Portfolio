import { Heart, BookOpen, Camera, Gamepad2, Plane, Cpu, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const iconMap = {
  "book-open": BookOpen,
  camera: Camera,
  "gamepad-2": Gamepad2,
  plane: Plane,
  cpu: Cpu,
};

export default function Hobbies({ items = [], embedded = false }) {
  if (!items.length) return null;

  return (
    <section id="hobbies" className={`${embedded ? "" : "-mx-32 bg-slate-50 dark:bg-navy-900"} py-16 md:py-24`}>
      <div className={embedded ? "" : "container px-32"}>
        <SectionHeading icon={Heart} title="Hobbies" subtitle="What I enjoy outside of work" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((hobby, index) => {
            const Icon = iconMap[hobby.icon] || Sparkles;
            return (
              <Reveal
                key={hobby.id}
                delay={index * 60}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{hobby.name}</span>
                {hobby.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{hobby.description}</p>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
