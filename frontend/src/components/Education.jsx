import {
  LuGraduationCap as GraduationCap,
} from "react-icons/lu";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Education({ items = [] }) {
  if (!items.length) return null;

  return (
    <section id="education" className="-mx-12 bg-slate-50 dark:bg-navy-800 py-16 md:-mx-32 md:py-24">
      <div className="container px-8 md:px-32">
        <SectionHeading icon={GraduationCap} title="Education" subtitle="My academic journey so far" />

        <div className="relative">
          {/* connecting line: horizontal on desktop, vertical on mobile */}
          <div className="hidden lg:block absolute top-[46px] left-0 right-0 h-0.5 bg-slate-200 dark:bg-navy-700" />
          <div className="lg:hidden absolute top-0 bottom-0 left-[19px] w-0.5 bg-slate-200 dark:bg-navy-700" />

          <ol className="relative flex flex-col gap-8 lg:flex-row lg:gap-6">
            {items.map((item, index) => (
              <Reveal
                as="li"
                key={item.id}
                delay={index * 100}
                className="relative flex-1 pl-12 lg:pl-0"
              >
                {/* dot */}
                <span className="absolute left-[11px] top-1 lg:left-1/2 lg:-translate-x-1/2 lg:top-[38px] flex h-4 w-4 items-center justify-center rounded-full bg-accent ring-4 ring-white dark:ring-navy-900" />

                <div className="lg:pt-16">
                  <span className="hidden lg:inline-flex mb-4 items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {item.date}
                  </span>

                  <div className="group h-full rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-5 shadow-card hover:shadow-card-hover">
                    <span className="lg:hidden inline-flex mb-3 items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {item.date}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{item.degree}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.institution}</p>
                    {item.campus && (
                      <p className="text-sm text-slate-400 dark:text-slate-500">{item.campus}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    )}
                    {item.status && (
                      <span className="mt-3 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
