import { useEffect, useState } from "react";
import {
  LuFolderGit2 as FolderGit2,
  LuExternalLink as ExternalLink,
  LuSparkles as Sparkles,
  LuCode as Code,
  LuLayers as Layers,
  LuX as X,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { getTechIcon, TechIcon } from "./Skills";

const GRADIENTS = [
  "from-indigo-600 via-purple-600 to-pink-500",
  "from-blue-600 via-cyan-600 to-teal-500",
  "from-emerald-600 via-teal-600 to-cyan-500",
  "from-violet-600 via-indigo-600 to-blue-500",
  "from-amber-500 via-orange-600 to-rose-600",
];

function TechBadge({ name }) {
  const tech = getTechIcon(name);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50/90 dark:bg-navy-800/90 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:shadow-md hover:shadow-accent/15 hover:text-accent dark:hover:border-accent/60 dark:hover:text-accent-light cursor-default select-none">
      {tech ? (
        <TechIcon tech={tech} className="h-4 w-4 shrink-0 transition-transform duration-200 hover:scale-110" />
      ) : (
        <Code className="h-3.5 w-3.5 text-accent shrink-0" />
      )}
      <span>{tech?.label || name}</span>
    </span>
  );
}

export default function Projects({ items = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedProject) return undefined;
    const onKey = (e) => e.key === "Escape" && setSelectedProject(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  if (!items || items.length === 0) return null;

  // Extract distinct categories
  const categories = [
    "All",
    ...Array.from(new Set(items.map((p) => p.category).filter(Boolean))),
  ];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((p) => p.category === activeCategory);

  // Helper to extract clean tech list
  const getProjectTech = (project) => {
    if (!project) return [];
    const techArray = Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
        ? project.technologies.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    const toolsArray = Array.isArray(project.tools)
      ? project.tools
      : typeof project.tools === "string"
        ? project.tools.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return Array.from(new Set([...techArray, ...toolsArray])).filter(Boolean);
  };

  return (
    <section id="projects" className="-mx-8 bg-slate-50/50 dark:bg-navy-900/60 px-8 py-16 md:-mx-32 md:px-32 md:py-24 border-y border-slate-200/60 dark:border-navy-800">
      <div className="container">
        <SectionHeading
          icon={FolderGit2}
          title="Projects"
          subtitle="Featured software engineering & creative work"
        />

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${activeCategory === cat
                  ? "bg-accent text-white shadow-md shadow-accent/20 scale-105"
                  : "border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:border-accent/40 hover:text-accent"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid / Mobile Rail */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 -mx-4 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:snap-none">
          {filteredItems.map((project, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];

            return (
              <Reveal
                key={project.id || index}
                delay={index * 100}
                className="h-full shrink-0 w-[85vw] max-w-[340px] sm:w-[360px] md:w-auto md:max-w-none snap-start md:snap-align-none"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-navy-700/80 bg-white dark:bg-navy-800/90 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card-hover cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  aria-label={`View details for ${project.title}`}
                >
                  {/* Thumbnail / Header Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-navy-900">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} p-6 relative`}>
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                        <div className="relative z-10 flex flex-col items-center gap-2 text-center text-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
                            <Layers className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                            {project.category || "Project"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.featured && (
                      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-accent/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    )}

                    {/* Category Pill */}
                    {project.category && !project.featured && (
                      <span className="absolute top-3 left-3 z-10 rounded-full bg-navy-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/10">
                        {project.category}
                      </span>
                    )}
                  </div>

                  {/* Project Body: Title & 3-line Description */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-accent">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                      <span>View details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Pop-up Details Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} project details`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project modal"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto scrollbar-none flex-1">
              {/* Modal Image Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 relative">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/30">
                        <Layers className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                        {selectedProject.category || "Project Details"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Badges on Modal Banner */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {selectedProject.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> Featured Project
                    </span>
                  )}
                  {selectedProject.category && (
                    <span className="rounded-full bg-navy-950/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
                      {selectedProject.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Details Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedProject.title}
                  </h2>
                </div>

                {/* Full Description */}
                {selectedProject.description && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      About the Project
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Tools & Technologies */}
                {getProjectTech(selectedProject).length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                      Technologies &amp; Tools Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getProjectTech(selectedProject).map((techName) => (
                        <TechBadge key={techName} name={techName} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Links */}
                {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                  <div className="pt-4 border-t border-slate-200 dark:border-navy-700/80 flex flex-wrap items-center gap-3">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent min-w-[140px]"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-slate-400 hover:text-slate-900 dark:hover:border-navy-500 dark:hover:text-white min-w-[140px] ${!selectedProject.liveUrl ? "flex-1" : ""
                          }`}
                      >
                        <FaGithub className="h-4 w-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
