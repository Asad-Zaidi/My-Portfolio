import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Download } from "lucide-react";
import useActiveSection from "../hooks/useActiveSection";
import resumePdf from "../assets/Asad-Zaidi_CV.pdf";

export default function Navbar({ personal, nav, resume }) {
  const ids = nav.map((item) => item.href.replace("#", ""));
  const [active, selectSection] = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resumeFile = resume?.file || resumePdf;
  const hasResume = Boolean(resumeFile);

  return (
    <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled
          ? `${dark ? "bg-navy-900/90" : "bg-white/90"} backdrop-blur-md shadow-card`
          : `${dark ? "bg-navy-900/60" : "bg-white/60"} backdrop-blur-sm`
        }`}
    >
      <nav className="px-8 container flex h-[56px] items-center justify-between md:px-32" aria-label="Primary">
        <a
          href="#home"
          className="flex items-center gap-2 font-bold text-slate-900 dark:text-white shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-md"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm">
            {personal.initials}
          </span>
          <span className="text-lg">{personal.name}</span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => selectSection(id)}
                    className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform origin-left ${isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-900/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <a
            href={hasResume ? resumeFile : undefined}
            download={hasResume ? "Asad-Zaidi_CV.pdf" : undefined}
            aria-disabled={!hasResume}
            title={hasResume ? resume.label : "Resume coming soon"}
            onClick={(event) => {
              if (!hasResume) event.preventDefault();
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${hasResume
                ? "bg-accent text-white hover:bg-accent-dark"
                : "bg-accent/40 text-white/70 cursor-not-allowed"
              }`}
          >
            {resume.label}
            <Download className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md text-slate-900 dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`lg:hidden overflow-hidden ${dark ? "bg-navy-900/95" : "bg-white/95"} backdrop-blur-md transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[28rem]" : "max-h-0"
          }`}
      >
        <ul className="container flex flex-col gap-1 py-4">
          {nav.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => {
                    selectSection(id);
                    setOpen(false);
                  }}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-accent/20 text-slate-900 dark:text-white" : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
          <li className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <a
              href={hasResume ? resumeFile : undefined}
              download={hasResume ? "Asad-Zaidi_CV.pdf" : undefined}
              aria-disabled={!hasResume}
              onClick={(event) => {
                if (!hasResume) event.preventDefault();
                setOpen(false);
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${hasResume ? "bg-accent text-white" : "bg-accent/40 text-white/70 cursor-not-allowed"
                }`}
            >
              {resume.label}
              <Download className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>

    </header>
  );
}
