import { User, Cake, MapPin, Mail, Phone, Flag, CircleCheck, CheckCircle2, LayoutDashboard, Terminal } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const rowIconMap = {
  user: User,
  cake: Cake,
  "map-pin": MapPin,
  mail: Mail,
  phone: Phone,
  flag: Flag,
  "circle-check": CircleCheck,
};

export default function About({ about, personalInfoCard }) {
  if (!about) return null;

  return (
    <section id="about" className="bg-white dark:bg-navy-950 py-16 md:py-24">
      <div className="container">
        <SectionHeading icon={User} title={about.heading} />

        <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          {/* left: narrative */}
          <Reveal className="min-w-0">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
              {about.paragraph}
            </p>

            {about.traits?.length > 0 && (
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {about.traits.map((trait) => (
                  <li
                    key={trait}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    {trait}
                  </li>
                ))}
              </ul>
            )}

            {/* small supporting illustration */}
            <div className="mt-8 hidden sm:flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-navy-700 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-navy-900 dark:to-navy-800 p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <LayoutDashboard className="h-7 w-7" />
              </span>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-white -ml-6 mt-6 shadow-card">
                <Terminal className="h-7 w-7" />
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Building interfaces and pipelines that turn ideas into working software.
              </p>
            </div>
          </Reveal>

          {/* right: personal info card */}
          {personalInfoCard && (
            <Reveal delay={120} className="min-w-0">
              <div className="relative min-w-0 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-card p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
                      {personalInfoCard.heading}
                    </h3>
                    <dl className="space-y-4">
                      {personalInfoCard.rows.map((row) => {
                        const Icon = rowIconMap[row.icon] || User;
                        return (
                          <div key={row.label} className="flex min-w-0 items-center gap-3 text-sm">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                              <Icon className="h-4 w-4" />
                            </span>
                            <dt className="w-20 shrink-0 text-slate-500 dark:text-slate-400 sm:w-28">{row.label}</dt>
                            <dd
                              className={`min-w-0 flex-1 overflow-hidden truncate break-words font-medium ${
                                row.highlight
                                  ? "text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
                                  : "text-slate-800 dark:text-slate-100"
                              }`}
                            >
                              {row.highlight && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                              {row.value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>

                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
