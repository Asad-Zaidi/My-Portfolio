import {
  LuCpu as Cpu,
} from "react-icons/lu";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiVscodium,
} from "react-icons/si";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";

const techIcons = [
  { key: "react", label: "React", icon: SiReact, color: "#61DAFB" },
  { key: "nodejs", label: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { key: "node", label: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { key: "mongodb", label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { key: "tailwind", label: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { key: "docker", label: "Docker", icon: SiDocker, color: "#2496ED" },
  { key: "vscode", label: "VS Code", icon: SiVscodium, color: "#007ACC" },
  { key: "figma", label: "Figma", icon: SiFigma, color: "#F24E1E" },
  { key: "git", label: "Git", icon: SiGit, color: "#F05032" },
  { key: "python", label: "Python", icon: SiPython, color: "#3776AB" },
];

function getTechIcon(key) {
  return techIcons.find((tech) => tech.key === (key || "").toLowerCase()) || null;
}

function LanguageBar({ name, percent, delay }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700 dark:text-slate-200">{name}</span>
        <span className="text-slate-400 dark:text-slate-500 font-medium">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: inView ? `${percent}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export default function Skills({ languages = [], tools = [] }) {
  if (!languages.length && !tools.length) return null;

  return (
    <div id="skills">
      <SectionHeading icon={Cpu} title="Skills" subtitle="Languages & tools I work with" />

      <div className="space-y-8">
        {languages.length > 0 && (
          <Reveal className="rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Languages
            </h3>
            <div className="space-y-4">
              {languages.map((lang, index) => (
                <LanguageBar key={lang.name} name={lang.name} percent={lang.percent} delay={index * 80} />
              ))}
            </div>
          </Reveal>
        )}

        {tools.length > 0 && (
          <Reveal delay={100} className="rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Technologies &amp; Tools
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {tools.map((tool) => {
                const tech = getTechIcon(tool.icon);
                return (
                  <div
                    key={tool.name}
                    title={tool.name}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-slate-200 dark:border-navy-700 p-3 hover:border-accent/40 hover:shadow-card-hover"
                  >
                    <span className="flex h-9 w-9 items-center justify-center">
                      {tech ? (
                        <tech.icon className="h-8 w-8" color={tech.color} />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">
                          {tool.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full">
                      {tool.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
