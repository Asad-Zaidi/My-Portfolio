import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuMenu as Menu,
  LuX as X,
  LuMoon as Moon,
  LuSun as Sun,
  LuDownload as Download,
} from "react-icons/lu";
import resumePdf from "../assets/Asad-Zaidi_CV.pdf";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ personal, resume }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggleDark } = useTheme();

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
  const onBlogPage = location.pathname.startsWith("/blogs");
  const safePersonal = personal || { initials: "AZ", name: "Asad Zaidi" };
  const safeResume = resume || { label: "Download CV" };

  return (
    <header
        className={`fixed inset-x-0 top-0 z-50 ${scrolled
          ? `${dark ? "bg-navy-900/80" : "bg-white/80"} backdrop-blur-sm shadow-card`
          : `${dark ? "bg-navy-900/60" : "bg-white/60"} backdrop-blur-sm`
        }`}
    >
      <nav className="px-8 container flex h-[56px] items-center justify-between md:px-32" aria-label="Primary">
        <Link
          to={onBlogPage ? "/" : "#home"}
          className="flex items-center gap-2 font-bold text-slate-900 dark:text-white shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-md"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm">
            {safePersonal.initials}
          </span>
          <span className="text-lg">{safePersonal.name}</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          <li>
            <Link
              to={onBlogPage ? "/" : "#home"}
              aria-current={!onBlogPage ? "page" : undefined}
              className={`relative block px-3 py-2 text-sm font-medium rounded-md ${!onBlogPage ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
            >
              Portfolio
              <span className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent ${!onBlogPage ? "scale-x-100" : "scale-x-0"}`} />
            </Link>
          </li>
          <li>
            <Link
              to="/blogs"
              aria-current={onBlogPage ? "page" : undefined}
              className={`relative block px-3 py-2 text-sm font-medium rounded-md ${onBlogPage ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
            >
              Blog
              <span className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent ${onBlogPage ? "scale-x-100" : "scale-x-0"}`} />
            </Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-900/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <a
            href={hasResume ? resumeFile : undefined}
            download={hasResume ? "Asad-Zaidi_CV.pdf" : undefined}
            aria-disabled={!hasResume}
            title={hasResume ? safeResume.label : "Resume coming soon"}
            onClick={(event) => {
              if (!hasResume) event.preventDefault();
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${hasResume
                ? "bg-accent text-white hover:bg-accent-dark"
                : "bg-accent/40 text-white/70 cursor-not-allowed"
              }`}
          >
            {safeResume.label}
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
        className={`lg:hidden overflow-hidden ${dark ? "bg-navy-900/95" : "bg-white/95"} backdrop-blur-md ${open ? "max-h-[28rem]" : "max-h-0"
          }`}
      >
        <ul className="container flex flex-col gap-1 py-4">
          <li>
            <Link
              to={onBlogPage ? "/" : "#home"}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${!onBlogPage ? "bg-accent/20 text-slate-900 dark:text-white" : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"}`}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/blogs"
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${onBlogPage ? "bg-accent/20 text-slate-900 dark:text-white" : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"}`}
            >
              Blog
            </Link>
          </li>
          <li className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={toggleDark}
              className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
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
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${hasResume ? "bg-accent text-white" : "bg-accent/40 text-white/70 cursor-not-allowed"
                }`}
            >
              {safeResume.label}
              <Download className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>

    </header>
  );
}
