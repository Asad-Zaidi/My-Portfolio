import { ArrowUp } from "lucide-react";
import SocialLinks from "./SocialLinks";

export default function Footer({ personal, nav, socials }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative -mx-32 bg-white text-slate-600 dark:bg-navy-950 dark:text-slate-400 pt-14 pb-8">
      <div className="container px-32 flex flex-col items-center gap-6 text-center">
        <a href="#home" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm">
            {personal.initials}
          </span>
          <span className="text-lg">{personal.name}</span>
        </a>

        {nav?.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <SocialLinks items={socials} />

        <div className="w-full border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            &copy; {year} {personal.name}. All rights reserved.
          </p>
          <a
            href="#home"
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-accent hover:border-accent hover:text-white dark:border-white/15 dark:text-slate-300 transition-colors"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
