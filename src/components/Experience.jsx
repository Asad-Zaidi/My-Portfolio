import { Briefcase, MapPin, Calendar } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience({ items = [] }) {
  if (!items.length) return null;

  return (
    <div id="experience">
      <SectionHeading icon={Briefcase} title="Experience" subtitle="Where I've applied what I know" />

      <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-700">
        {items.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 100} className="relative pl-12">
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 dark:bg-accent text-white text-xs font-bold shadow-card ring-4 ring-slate-50 dark:ring-navy-900">
              {item.logoText}
            </span>

            <div className="rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {item.role}
                    {item.org && <span className="font-medium text-accent"> · {item.org}</span>}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {item.date}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {item.location}
                      </span>
                    )}
                  </div>
                </div>
                {item.type && (
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent whitespace-nowrap">
                    {item.type}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              )}

              {item.technologies?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md bg-slate-100 dark:bg-navy-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
