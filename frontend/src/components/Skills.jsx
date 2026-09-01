import {
  LuCpu as Cpu,
} from "react-icons/lu";
import {
  SiDocker,
  SiMongodb,
  SiPostman,
  SiExpress,
  SiTypescript,
  SiCplusplus,
  SiC,
  SiGo,
  SiPostgresql,
  SiMysql,
  SiKotlin,
  SiDart,
  SiRuby,
  SiCloudinary,
  SiFastapi,
  SiNumpy,
  SiTensorflow,
  SiJupyter,
  SiGooglecolab
} from "react-icons/si";
import { TbBrandCSharp, TbBrandReactNative } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import { RiTailwindCssFill } from "react-icons/ri";
import {
  FaFigma, FaNodeJs, FaReact, FaGitAlt, FaGithub, FaPython, FaJava,
  FaCss, FaHtml5, FaJs, FaRust, FaFlutter, FaSwift, FaPhp
}
  from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import useReveal from "../hooks/useReveal";

export const techIcons = [
  // Programming Languages
  { key: "javascript", label: "JavaScript", icon: FaJs, color: "#F7DF1E" },
  { key: "typescript", label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { key: "python", label: "Python", icon: FaPython, color: "#3776AB" },
  { key: "java", label: "Java", icon: FaJava, color: "#ED8B00" },
  { key: "cplusplus", label: "C++", icon: SiCplusplus, color: "#00599C" },
  { key: "c", label: "C", icon: SiC, color: "#A8B9CC" },
  { key: "csharp", label: "C#", icon: TbBrandCSharp, color: "#239120" },
  { key: "html", label: "HTML5", icon: FaHtml5, color: "#E34F26" },
  { key: "css", label: "CSS3", icon: FaCss, color: "#663399" },
  { key: "php", label: "PHP", icon: FaPhp, color: "#777BB4" },
  { key: "rust", label: "Rust", icon: FaRust, color: "#DEA584" },
  { key: "go", label: "Go", icon: SiGo, color: "#00ADD8" },
  { key: "sql", label: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { key: "mysql", label: "MySQL", icon: SiMysql, color: "#4479A1" },
  { key: "swift", label: "Swift", icon: FaSwift, color: "#F05138" },
  { key: "kotlin", label: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
  { key: "dart", label: "Dart", icon: SiDart, color: "#0175C2" },
  { key: "ruby", label: "Ruby", icon: SiRuby, color: "#CC342D" },
  { key: "flutter", label: "Flutter", icon: FaFlutter, color: "#02569B" },

  // Frameworks, Libraries & Tools
  { key: "express", label: "Express.js", icon: SiExpress, adaptive: true },
  { key: "cloudinary", label: "Cloudinary", icon: SiCloudinary, color: "#3448C5" },
  { key: "fastapi", label: "FastAPI", icon: SiFastapi, color: "#009688" },
  { key: "react", label: "ReactJS", icon: FaReact, color: "#61DAFB" },
  { key: "reactnative", label: "React Native", icon: TbBrandReactNative, color: "#0081A3" },
  { key: "node", label: "Node.js", icon: FaNodeJs, color: "#5FA04E" },
  { key: "mongodb", label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { key: "tailwind", label: "Tailwind CSS", icon: RiTailwindCssFill, color: "#06B6D4" },
  { key: "docker", label: "Docker", icon: SiDocker, color: "#2496ED" },
  { key: "vscode", label: "VS Code", icon: VscVscode, color: "#007ACC" },
  { key: "googlecolab", label: "Google Colab", icon: SiGooglecolab, color: "#F37626" },
  { key: "jupyter", label: "Jupyter Notebook", icon: SiJupyter, color: "#F37626" },
  { key: "figma", label: "Figma", icon: FaFigma, color: "#1ABC9C" },
  { key: "git", label: "Git", icon: FaGitAlt, color: "#F05032" },
  { key: "github", label: "GitHub", icon: FaGithub, adaptive: true },
  { key: "postman", label: "Postman", icon: SiPostman, color: "#FF6C37" },
  { key: "numpy", label: "NumPy", icon: SiNumpy, color: "#1565C0" },
  { key: "tensorflow", label: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
];

export function getTechIcon(key) {
  if (!key) return null;
  const normalized = key.toLowerCase().trim();
  return (
    techIcons.find((tech) => tech.key === normalized || tech.label.toLowerCase() === normalized) ||
    null
  );
}

export function TechIcon({ tech, className = "", style = {} }) {
  if (!tech || !tech.icon) return null;
  const isAdaptive =
    tech.adaptive ||
    !tech.color ||
    tech.color === "#000000" ||
    tech.color === "#000000ff" ||
    tech.color?.toLowerCase() === "#181717" ||
    tech.color === "black";

  const IconComponent = tech.icon;

  return (
    <IconComponent
      className={`${className} ${isAdaptive ? "text-slate-900 dark:text-white" : ""}`}
      style={!isAdaptive ? { color: tech.color, ...style } : style}
    />
  );
}

function LanguageBar({ name, percent, delay, icon }) {
  const [ref, inView] = useReveal();
  const tech = getTechIcon(icon || name);
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {tech && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <TechIcon tech={tech} className="h-4 w-4" />
            </span>
          )}
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{name}</span>
        </div>
        <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 ml-2">{percent}%</span>
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
                <LanguageBar
                  key={lang.name || index}
                  name={lang.name}
                  icon={lang.icon}
                  percent={lang.percent}
                  delay={index * 80}
                />
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
                const tech = getTechIcon(tool.icon || tool.name);
                return (
                  <div
                    key={tool.name}
                    title={tool.name}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-slate-200 dark:border-navy-700 p-3 hover:border-accent/40 hover:shadow-card-hover"
                  >
                    <span className="flex h-9 w-9 items-center justify-center">
                      {tech ? (
                        <TechIcon tech={tech} className="h-8 w-8" />
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
