import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  Sparkles,
  Info,
  IdCard,
  Wrench,
  GraduationCap,
  Briefcase,
  Award,
  BadgeCheck,
  Heart,
  Languages as LanguagesIcon,
  BarChart3,
  Mail,
  FileText,
  Share2,
  Menu as MenuIcon,
  Inbox,
  ExternalLink,
} from "lucide-react";

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
      { to: "/admin/sections/experience", label: "Experience", icon: Briefcase },
      { to: "/admin/sections/certifications", label: "Certifications", icon: Award },
      { to: "/admin/sections/badges", label: "Badges", icon: BadgeCheck },
      { to: "/admin/sections/hobbies", label: "Hobbies", icon: Heart },
      { to: "/admin/sections/languages", label: "Languages", icon: LanguagesIcon },
      { to: "/admin/sections/stats", label: "Stats", icon: BarChart3 },
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
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-accent/15 text-accent-light" : "text-slate-400 hover:bg-navy-800 hover:text-slate-100"
  }`;

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-navy-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-navy-700 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">A</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-white">Admin Panel</div>
          <div className="truncate text-[11px] text-slate-500">Portfolio CMS</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onNavigate}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-navy-700 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-navy-800 hover:text-slate-100"
        >
          <ExternalLink className="h-4 w-4 shrink-0" /> View live site
        </a>
      </div>
    </div>
  );
}
