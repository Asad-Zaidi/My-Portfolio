import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard as LayoutDashboard,
  LuSettings as Settings,
  LuUser as User,
  LuSparkles as Sparkles,
  LuInfo as Info,
  LuIdCard as IdCard,
  LuWrench as Wrench,
  LuGraduationCap as GraduationCap,
  LuFolderGit2 as FolderGit2,
  LuBriefcase as Briefcase,
  LuAward as Award,
  LuBadgeCheck as BadgeCheck,
  LuHeart as Heart,
  LuLanguages as LanguagesIcon,
  LuChartColumn as BarChart3,
  LuMail as Mail,
  LuFileText as FileText,
  LuShare2 as Share2,
  LuMenu as MenuIcon,
  LuInbox as Inbox,
  LuKeyRound as KeyRound,
  LuExternalLink as ExternalLink,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
} from "react-icons/lu";

const groups = [
  {
    title: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Profile",
    items: [
      { to: "/admin/sections/meta", label: "General & SEO", icon: Settings },
      { to: "/admin/sections/personal", label: "Personal Info", icon: User },
      { to: "/admin/sections/hero", label: "Hero Section", icon: Sparkles },
      { to: "/admin/sections/about", label: "About", icon: Info },
      { to: "/admin/sections/personalInfoCard", label: "Info Card", icon: IdCard },
      { to: "/admin/sections/contact", label: "Contact Section", icon: Mail },
      { to: "/admin/sections/resume", label: "Résumé", icon: FileText },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/sections/skills", label: "Skills", icon: Wrench },
      { to: "/admin/sections/education", label: "Education", icon: GraduationCap },
      { to: "/admin/sections/projects", label: "Projects", icon: FolderGit2 },
      { to: "/admin/sections/experience", label: "Experience", icon: Briefcase },
      { to: "/admin/sections/certifications", label: "Certifications", icon: Award },
      { to: "/admin/sections/badges", label: "Badges", icon: BadgeCheck },
      { to: "/admin/sections/hobbies", label: "Hobbies", icon: Heart },
      { to: "/admin/sections/languages", label: "Languages", icon: LanguagesIcon },
      { to: "/admin/sections/stats", label: "Stats", icon: BarChart3 },
    ],
  },
  {
    title: "Blog",
    items: [
      { to: "/admin/sections/blogs", label: "Blog Posts", icon: FileText },
    ],
  },
  {
    title: "Site",
    items: [
      { to: "/admin/sections/socials", label: "Social Links", icon: Share2 },
      { to: "/admin/sections/nav", label: "Navigation", icon: MenuIcon },
    ],
  },
  {
    title: "Inbox",
    items: [{ to: "/admin/messages", label: "Messages", icon: Inbox }],
  },
  {
    title: "Account",
    items: [
      { to: "/admin/change-password", label: "Change Password", icon: KeyRound },
    ],
  },
];

export default function Sidebar({ onNavigate, collapsed = false, onToggleCollapse }) {
  const linkClass = ({ isActive }) =>
    `flex items-center ${
      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
    } rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent/10 text-accent font-semibold dark:bg-accent/15 dark:text-accent-light"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-slate-100"
    }`;

  return (
    <div className="relative flex h-full flex-col bg-white dark:bg-navy-900">
      {/* Collapse / Expand Toggle Button (Desktop) */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute right-0 top-1/2 z-50 hidden h-7 w-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white p-0 text-slate-600 shadow-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-navy-600 dark:bg-navy-800 dark:text-slate-300 dark:hover:bg-navy-700 dark:hover:text-white focus:outline-none lg:flex"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {/* Brand Header */}
      <div className={`flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-navy-700 ${collapsed ? "justify-center px-2" : "gap-2 px-5"}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white shadow-sm">
          A
        </span>
        {!collapsed && (
          <div className="min-w-0 transition-opacity duration-200">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-white">Admin Panel</div>
            <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">Portfolio CMS</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-5 overflow-y-auto ${collapsed ? "px-2 py-4" : "px-3 py-5"} scrollbar-none`}>
        {groups.map((group, gIdx) => (
          <div key={group.title}>
            {!collapsed ? (
              <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.title}
              </div>
            ) : (
              gIdx > 0 && <div className="my-2 border-t border-slate-200 dark:border-navy-800" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={linkClass}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Link */}
      <div className={`border-t border-slate-200 dark:border-navy-700 ${collapsed ? "p-2" : "p-3"}`}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-slate-100 ${
            collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
          }`}
          title={collapsed ? "View live site" : undefined}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!collapsed && <span>View live site</span>}
        </a>
      </div>
    </div>
  );
}

