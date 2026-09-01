import { useEffect, useState } from "react";
import { LuRefreshCw, LuWifiOff } from "react-icons/lu";
import { fetchPortfolio } from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Education from "../components/Education";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import Badges from "../components/Badges";
import Hobbies from "../components/Hobbies";
import Languages from "../components/Languages";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PortfolioSkeleton from "../components/skeletons/PortfolioSkeleton";

function getUniqueTechNames(items = []) {
  const values = [];

  (Array.isArray(items) ? items : []).forEach((item) => {
    const techs = Array.isArray(item?.technologies) ? item.technologies : [];
    const tools = Array.isArray(item?.tools) ? item.tools : [];
    const combined = [...techs, ...tools];

    combined.forEach((value) => {
      const normalized = String(value || "").trim();
      if (normalized) values.push(normalized.toLowerCase());
    });
  });

  return [...new Set(values)].length;
}

function resolveStats(stats = [], projects = [], skills = {}) {
  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const skillTools = Array.isArray(skills?.tools) ? skills.tools.map((tool) => tool?.name).filter(Boolean) : [];
  const skillLanguages = Array.isArray(skills?.languages) ? skills.languages.map((lang) => lang?.name).filter(Boolean) : [];
  const technologyCount = getUniqueTechNames(projects) + new Set([...skillTools, ...skillLanguages].map((name) => String(name).trim().toLowerCase()).filter(Boolean)).size;

  return (Array.isArray(stats) ? stats : []).map((stat) => {
    const label = String(stat?.label || "").toLowerCase();
    const isProjectStat = stat?.auto || /project/.test(label) || /completed/.test(label);
    const isTechStat = stat?.auto || /technology|tech|stack|tool/.test(label);

    if (isProjectStat && !/year|experience/.test(label)) {
      return { ...stat, value: String(projectCount) };
    }

    if (isTechStat && !/project/.test(label) && !/year|experience|dedicat/.test(label)) {
      return { ...stat, value: String(technologyCount) };
    }

    return stat;
  });
}

function setMetaTag(selector, attr, value) {
  if (!value) return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, attrName, attrValue] = selector.match(/\[(.+)="(.+)"\]/) || [];
    if (attrName && attrValue) el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function Portfolio() {
  // All content lives in MongoDB and is served by the backend at
  // GET /api/portfolio.
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const loadData = () => {
    setIsRetrying(true);
    setError(null);
    fetchPortfolio()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err?.message || "Unable to load portfolio data.");
      })
      .finally(() => {
        setIsRetrying(false);
      });
  };

  useEffect(() => {
    let cancelled = false;

    fetchPortfolio()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Unable to load portfolio data.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { meta, personal, stats, hero, about, personalInfoCard, education, projects, experience, skills, certifications, badges, hobbies, languages, contact, socials, resume, nav } =
    data || {};
  const computedStats = resolveStats(stats, projects, skills);

  // SEO: keep <head> in sync with the fetched content rather than hardcoding it in index.html
  useEffect(() => {
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    setMetaTag('meta[name="description"]', "content", meta.description);
    setMetaTag('meta[name="author"]', "content", meta.author);
    setMetaTag('meta[property="og:title"]', "content", meta.title);
    setMetaTag('meta[property="og:description"]', "content", meta.description);
    if (meta.ogImage) setMetaTag('meta[property="og:image"]', "content", meta.ogImage);
    setMetaTag('meta[name="theme-color"]', "content", meta.themeColor);
  }, [meta]);

  if (error && !data) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-center dark:bg-navy-950 sm:px-6 lg:px-8 overflow-hidden selection:bg-rose-500 selection:text-white">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-[100px] dark:bg-rose-600/15" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-[100px] dark:bg-accent/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.03)_0,transparent_70%)]" />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/85 dark:shadow-black/40 sm:p-10">
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            Connection Failed
          </div>

          {/* Icon Aura */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 blur-lg dark:from-rose-500/30 dark:to-amber-500/10" />
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50 to-white text-rose-500 shadow-sm dark:border-rose-500/30 dark:from-rose-950/40 dark:to-navy-900 dark:text-rose-400">
              <LuWifiOff className="h-9 w-9" />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Unable to Load Portfolio
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            We couldn't connect to the server to fetch the portfolio data. Please check your network connection or try again.
          </p>

          {/* Error Details Pill */}
          {error && (
            <div className="mb-6 rounded-xl border border-slate-200/80 bg-slate-100/80 px-3.5 py-2.5 text-xs font-mono text-slate-600 dark:border-white/5 dark:bg-navy-950/70 dark:text-slate-400 break-words">
              {String(error)}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={loadData}
            disabled={isRetrying}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-dark hover:shadow-accent/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LuRefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="px-8 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200 overflow-x-hidden md:px-32">
      <Navbar personal={personal} nav={nav} resume={resume} />

      <main>
        <Hero personal={personal} stats={computedStats} hero={hero} socials={socials} />
        <About personal={personal} about={about} personalInfoCard={personalInfoCard} />
        <Education items={education} />
        <Projects items={projects} />

        <section className="-mx-6 bg-white dark:bg-navy-950 py-16 md:mx-0 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3">
              <Experience items={experience} />
            </div>
            <div className="lg:col-span-2">
              <Skills languages={skills?.languages} tools={skills?.tools} />
            </div>
          </div>
        </section>

        <Certifications items={certifications} />
        <Badges items={badges} />
        <section className="-mx-8 bg-slate-50 px-8 py-8 dark:bg-navy-900 md:-mx-32 md:px-32 md:py-16">
          <div className="container grid gap-12 lg:grid-cols-2 lg:items-start">
            <Hobbies items={hobbies} embedded />
            <Languages items={languages} embedded />
          </div>
        </section>
        <Contact contact={contact} resume={resume} />
      </main>

      <Footer personal={personal} nav={nav} socials={socials} />
    </div>
  );
}
