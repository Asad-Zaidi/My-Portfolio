import { ArrowRight, Code2, Sparkles } from "lucide-react";
import Avatar from "./Avatar";
import SocialLinks from "./SocialLinks";
import profileImage from "../assets/profile.png";

const codeTokenPattern = /(\b(?:function|return|const|while)\b|\b(?:true|false|null|undefined)\b|[{}();=+]|"[^"]*"|'[^']*'|\b(?:build|success|engineer|passion|consistency|learning|improve)\b)/g;

function highlightCodeLine(line) {
  return line.split(codeTokenPattern).map((token, index) => {
    if (!token) return null;

    let color = "text-slate-700 dark:text-slate-300";
    if (/^(function|return|const|while)$/.test(token)) color = "text-violet-600 dark:text-violet-300";
    else if (/^(true|false|null|undefined)$/.test(token)) color = "text-orange-600 dark:text-orange-300";
    else if (/^[{}();=+]$/.test(token)) color = "text-slate-500 dark:text-slate-400";
    else if (/^(?:"[^"]*"|'[^']*')$/.test(token)) color = "text-emerald-600 dark:text-emerald-300";
    else if (/^(build|success|engineer|passion|consistency|learning|improve)$/.test(token)) color = "text-sky-600 dark:text-sky-300";

    return (
      <span key={`${token}-${index}`} className={color}>
        {token}
      </span>
    );
  });
}

export default function Hero({ personal, stats, hero, socials }) {
  return (
    <section
      id="home"
      className="relative -mx-32 overflow-hidden bg-white dark:bg-navy-900 pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl motion-safe:animate-blob" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl motion-safe:animate-blob [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden focusable="false">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative grid gap-14 px-32 lg:grid-cols-2 lg:items-center">
        {/* text column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 motion-safe:animate-fade-up">
            <span aria-hidden>👋</span> {personal.greeting}
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight motion-safe:animate-fade-up [animation-delay:80ms] motion-safe:opacity-0">
            <span className="text-slate-900 dark:text-white">{personal.firstName}</span>{" "}
            <span className="bg-gradient-to-r from-accent-light to-blue-300 bg-clip-text text-transparent">
              {personal.lastName}
            </span>
          </h1>

          <p className="mt-3 text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200 motion-safe:animate-fade-up [animation-delay:140ms] motion-safe:opacity-0">
            {personal.title}
          </p>

          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400 leading-relaxed motion-safe:animate-fade-up [animation-delay:200ms] motion-safe:opacity-0">
            {personal.tagline}
          </p>

          <div className="mt-6 motion-safe:animate-fade-up [animation-delay:260ms] motion-safe:opacity-0">
            <SocialLinks items={socials} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-fade-up [animation-delay:320ms] motion-safe:opacity-0">
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-glow hover:bg-accent-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {hero.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>

          {stats?.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl motion-safe:animate-fade-up [animation-delay:380ms] motion-safe:opacity-0">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-4 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</dd>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* visual column */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none motion-safe:animate-fade-in [animation-delay:200ms] motion-safe:opacity-0">
          <div className="relative aspect-square max-w-sm mx-auto">
            <div className="absolute inset-0 rounded-full border border-white/10 motion-safe:animate-spin-slow" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-accent/30 via-blue-500/10 to-transparent blur-xl" />

            <div className="absolute inset-10 rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-glow">
              <Avatar name={personal.name} src={personal.heroImage || profileImage} className="h-full w-full text-6xl" />
            </div>

            <span className="absolute top-2 left-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-accent-light shadow-card dark:bg-navy-900 dark:border-white/10 motion-safe:animate-float">
              <Code2 className="h-6 w-6" />
            </span>
            <span className="absolute top-4 right-0 flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-card dark:bg-navy-800 dark:border-white/10 dark:text-emerald-400 motion-safe:animate-float [animation-delay:1.2s]">
              <Sparkles className="h-3.5 w-3.5" /> {personal.availability}
            </span>
          </div>

          {hero.codeSnippet?.length > 0 && (
            <div className="absolute -bottom-6 -right-12 hidden sm:block w-64 rounded-xl border border-slate-200 bg-slate-100/95 backdrop-blur-md p-4 shadow-card dark:border-white/10 dark:bg-navy-950/90 motion-safe:animate-float [animation-delay:0.6s]">
              <div className="flex gap-1.5 mb-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <pre className="font-mono text-[11px] leading-5 whitespace-pre-wrap">
                {hero.codeSnippet.map((line, index) => (
                  <div key={`${line}-${index}`}>{highlightCodeLine(line)}</div>
                ))}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
