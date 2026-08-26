import { getSocialIcon } from "./icons/SocialIcons";

const brandHoverClasses = {
  github: "hover:bg-slate-900 hover:border-slate-900",
  linkedin: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
  x: "hover:bg-slate-900 hover:border-slate-900",
  twitter: "hover:bg-sky-500 hover:border-sky-500",
  youtube: "hover:bg-red-600 hover:border-red-600",
  whatsapp: "hover:bg-green-500 hover:border-green-500",
  facebook: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  instagram: "hover:bg-pink-500 hover:border-pink-500",
  mail: "hover:bg-accent hover:border-accent",
  email: "hover:bg-accent hover:border-accent",
};

const brandIconClasses = {
  github: "text-slate-900 dark:text-slate-200",
  linkedin: "text-[#0A66C2]",
  x: "text-slate-900 dark:text-slate-200",
  twitter: "text-sky-500",
  youtube: "text-red-600",
  whatsapp: "text-green-500",
  facebook: "text-[#1877F2]",
  instagram: "text-pink-500",
  mail: "text-accent",
  email: "text-accent",
};

/**
 * Renders only the platforms present in data.json — never an empty/broken
 * icon for a social network that wasn't configured.
 */
export default function SocialLinks({ items = [], className = "", iconClassName = "h-[18px] w-[18px]" }) {
  const valid = items.filter((item) => item?.url && getSocialIcon(item.platform));

  if (!valid.length) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {valid.map((item) => {
        const Icon = getSocialIcon(item.platform);
        const isMail = item.platform === "mail" || item.platform === "email";
        const platform = (item.platform || "").toLowerCase();
        const hoverClasses = brandHoverClasses[platform] || "hover:bg-accent hover:border-accent";
        const iconColor = brandIconClasses[platform] || "text-slate-700 dark:text-white/90";
        return (
          <li key={item.platform}>
            <a
              href={item.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              aria-label={item.label || item.platform}
              title={item.label || item.platform}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-white/15 ${iconColor} ${hoverClasses} hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent`}
            >
              <Icon className={iconClassName} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
