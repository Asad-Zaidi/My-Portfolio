import {
  LuHeart as Heart,
  LuBookOpen as BookOpen,
  LuCamera as Camera,
  LuGamepad2 as Gamepad2,
  LuPlane as Plane,
  LuCpu as Cpu,
  LuSparkles as Sparkles,
} from "react-icons/lu";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const hobbyIcons = [
  { key: "book-open", icon: BookOpen },
  { key: "camera", icon: Camera },
  { key: "gamepad-2", icon: Gamepad2 },
  { key: "plane", icon: Plane },
  { key: "cpu", icon: Cpu },
];

function getHobbyIcon(key) {
  return hobbyIcons.find((hobby) => hobby.key === key)?.icon || Sparkles;
}

export default function Hobbies({ items = [], embedded = false }) {
  if (!items.length) return null;

  return (
    <section id="hobbies" className={`${embedded ? "" : "-mx-8 bg-slate-50 dark:bg-navy-900 md:-mx-32"}`}>
      <div className={embedded ? "" : "container px-8 md:px-32"}>
        <SectionHeading icon={Heart} title="Hobbies" subtitle="What I enjoy outside of work" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((hobby, index) => {
            const Icon = getHobbyIcon(hobby.icon);
            return (
              <Reveal
                key={hobby.id}
                delay={index * 60}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 text-center hover:shadow-card-hover"
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
