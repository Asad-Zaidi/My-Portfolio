import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuGraduationCap as GraduationCap,
  LuFolderGit2 as FolderGit2,
  LuBriefcase as Briefcase,
  LuAward as Award,
  LuInbox as Inbox,
  LuArrowUpRight as ArrowUpRight,
  LuLoaderCircle as Loader2,
  LuClock as Clock,
} from "react-icons/lu";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import { useAuth } from "../../context/AuthContext";
import { adminGetMessages } from "../../api/api";

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-accent/40 dark:border-navy-700 dark:bg-navy-800/50"
    >
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{label}</div>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { data, loading } = usePortfolioData();
  const { token } = useAuth();
  const [unread, setUnread] = useState(null);

  useEffect(() => {
    adminGetMessages(token)
      .then((messages) => setUnread(messages.filter((m) => !m.read).length))
      .catch(() => setUnread(null));
  }, [token]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back{data.personal?.firstName ? `, ${data.personal.firstName}` : ""} 👋</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's a quick snapshot of your portfolio content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={GraduationCap} label="Education entries" value={data.education?.length ?? 0} to="/admin/sections/education" />
        <StatCard icon={FolderGit2} label="Projects" value={data.projects?.length ?? 0} to="/admin/sections/projects" />
        <StatCard icon={Briefcase} label="Experience entries" value={data.experience?.length ?? 0} to="/admin/sections/experience" />
        <StatCard icon={Award} label="Certifications" value={data.certifications?.length ?? 0} to="/admin/sections/certifications" />
        <StatCard icon={Inbox} label="Unread messages" value={unread ?? "–"} to="/admin/messages" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/50">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Clock className="h-4 w-4" /> Last updated
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "Never"}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800/50">
        <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Quick links</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["General & SEO", "/admin/sections/meta"],
            ["Personal Info", "/admin/sections/personal"],
            ["Hero Section", "/admin/sections/hero"],
            ["Projects", "/admin/sections/projects"],
            ["Skills", "/admin/sections/skills"],
            ["Education", "/admin/sections/education"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 hover:border-accent/40 hover:text-slate-900 dark:border-navy-700 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              {label}
              <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
