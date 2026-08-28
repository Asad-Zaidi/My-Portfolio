import {
  LuArrowRight as ArrowRight,
  LuCodeXml as Code2,
  LuSparkles as Sparkles,
} from "react-icons/lu";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import Avatar from "./Avatar";
import profileImage from "../assets/profile.png";

const socialLinks = [
  { key: "github", label: "GitHub", icon: FaGithub, color: "#0f172a" },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: "#0A66C2" },
  { key: "x", label: "X", icon: FaXTwitter, color: "#0f172a" },
  { key: "twitter", label: "Twitter", icon: FaXTwitter, color: "#0ea5e9" },
  { key: "youtube", label: "YouTube", icon: FaYoutube, color: "#dc2626" },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "#22c55e" },
  { key: "facebook", label: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { key: "instagram", label: "Instagram", icon: FaInstagram, color: "#ec4899" },
  { key: "mail", label: "Email", icon: FaEnvelope, color: "#2563eb" },
  { key: "email", label: "Email", icon: FaEnvelope, color: "#2563eb" },
];

function getSocialLink(platform) {
  return socialLinks.find((social) => social.key === (platform || "").toLowerCase()) || null;
}

/**
 * Renders only the platforms present in the portfolio API — never an empty/broken
 * icon for a social network that wasn't configured.
 */
function SocialLinks({ items = [] }) {
  const valid = items
    .map((item) => ({ item, social: getSocialLink(item?.platform) }))
    .filter(({ item, social }) => item?.url && social);

  if (!valid.length) return null;

  return (
    <ul className="flex items-center gap-3">
      {valid.map(({ item, social }) => {
        const isMail = social.key === "mail" || social.key === "email";
        const Icon = social.icon;
        return (
          <li key={item.platform}>
            <a
              href={item.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              aria-label={item.label || social.label}
              title={item.label || social.label}
              style={{ "--social-color": social.color }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 dark:border-white/15 dark:text-white/90 hover:border-[var(--social-color)] hover:bg-[var(--social-color)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

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

export default function Hero({ personal = {}, stats = [], hero = {}, socials = [] }) {
  const ctaPrimary = hero?.ctaPrimary || { label: "Get in Touch", href: "#contact" };
  const ctaSecondary = hero?.ctaSecondary || { label: "View Experience", href: "#experience" };

  return (
    <section
      id="home"
      className="relative -mx-8 overflow-hidden bg-white dark:bg-navy-900 pt-28 pb-16 md:-mx-32 md:pt-36 md:pb-24"
    >
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 hidden h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:block" />
        <div className="absolute top-1/3 -right-16 hidden h-80 w-80 rounded-full bg-blue-400/10 blur-3xl sm:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden focusable="false">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative grid gap-14 px-8 md:px-32 lg:grid-cols-2 lg:items-center">
        {/* text column */}
        <div>
          {personal?.greeting && (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200">
              <span aria-hidden>👋</span> {personal.greeting}
            </span>
          )}

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-slate-900 dark:text-white">{personal?.firstName || "Portfolio"}</span>{" "}
            {personal?.lastName && (
              <span className="bg-gradient-to-r from-accent-light to-blue-300 bg-clip-text text-transparent">
                {personal.lastName}
              </span>
            )}
          </h1>

          {personal?.title && (
            <p className="mt-3 text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200">
              {personal.title}
            </p>
          )}

          {personal?.tagline && (
            <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {personal.tagline}
            </p>
          )}

          <div className="mt-6">
            <SocialLinks items={socials} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {ctaPrimary?.label && (
              <a
                href={ctaPrimary.href || "#contact"}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-glow hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {ctaPrimary.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {ctaSecondary?.label && (
              <a
                href={ctaSecondary.href || "#experience"}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {ctaSecondary.label}
              </a>
            )}
          </div>

          {stats?.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
              {stats.map((stat) => (
                <div
                  key={stat.id || stat.label}
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
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square max-w-sm mx-auto">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-accent/30 via-blue-500/10 to-transparent blur-xl" />

            <div className="absolute inset-10 rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-glow">
              <Avatar name={personal?.name || "Portfolio"} src={personal?.heroImage || profileImage} className="h-full w-full text-6xl" />
            </div>

            <span className="absolute top-2 left-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-accent-light shadow-card dark:bg-navy-900 dark:border-white/10">
              <Code2 className="h-6 w-6" />
            </span>
            {personal?.availability && (
              <span className="absolute top-4 right-0 flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-card dark:bg-navy-800 dark:border-white/10 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" /> {personal.availability}
              </span>
            )}
          </div>

          {hero?.codeSnippet?.length > 0 && (
            <div className="absolute -bottom-6 -right-12 hidden sm:block w-64 rounded-xl border border-slate-200 bg-slate-100/95 backdrop-blur-md p-4 shadow-card dark:border-white/10 dark:bg-navy-950/90">
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
