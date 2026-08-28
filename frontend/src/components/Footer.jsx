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

export default function Footer({ personal, nav, socials, noNegativeMargin = false }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`relative pt-6 bg-white text-slate-600 dark:bg-navy-950 dark:text-slate-400 ${noNegativeMargin ? "" : "-mx-12 md:-mx-32"}`}>
      <div className="container px-8 flex flex-col items-center gap-6 text-center md:px-32">
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
                <a href={item.href} className="hover:text-slate-900 dark:hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <SocialLinks items={socials} />

        <div className="w-full border-t  border-slate-200 dark:border-white/10 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            &copy; {year} {personal.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
