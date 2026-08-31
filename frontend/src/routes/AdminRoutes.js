import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../admin/components/AdminLayout";
import { PortfolioDataProvider } from "../context/PortfolioDataContext";
import {
  AdminDashboardSkeleton,
  AdminSectionSkeleton,
} from "../admin/components/AdminSkeleton";
import Skeleton from "../components/ui/Skeleton";

// Lazy load admin pages and sections
const Login = lazy(() => import("../admin/pages/Login"));
const Dashboard = lazy(() => import("../admin/pages/Dashboard"));
const MetaPage = lazy(() => import("../admin/pages/sections/MetaPage"));
const PersonalPage = lazy(() => import("../admin/pages/sections/PersonalPage"));
const HeroPage = lazy(() => import("../admin/pages/sections/HeroPage"));
const AboutPage = lazy(() => import("../admin/pages/sections/AboutPage"));
const PersonalInfoCardPage = lazy(() =>
  import("../admin/pages/sections/PersonalInfoCardPage")
);
const SkillsPage = lazy(() => import("../admin/pages/sections/SkillsPage"));
const ContactPage = lazy(() => import("../admin/pages/sections/ContactPage"));
const ResumePage = lazy(() => import("../admin/pages/sections/ResumePage"));
const StatsPage = lazy(() => import("../admin/pages/sections/StatsPage"));
const EducationPage = lazy(() =>
  import("../admin/pages/sections/EducationPage")
);
const ProjectsPage = lazy(() => import("../admin/pages/sections/ProjectsPage"));
const ExperiencePage = lazy(() =>
  import("../admin/pages/sections/ExperiencePage")
);
const CertificationsPage = lazy(() =>
  import("../admin/pages/sections/CertificationsPage")
);
const BlogsPage = lazy(() => import("../admin/pages/sections/BlogsPage"));
const BadgesPage = lazy(() => import("../admin/pages/sections/BadgesPage"));
const HobbiesPage = lazy(() => import("../admin/pages/sections/HobbiesPage"));
const LanguagesPage = lazy(() =>
  import("../admin/pages/sections/LanguagesPage")
);
const SocialsPage = lazy(() => import("../admin/pages/sections/SocialsPage"));
const NavPage = lazy(() => import("../admin/pages/sections/NavPage"));
const MessagesPage = lazy(() => import("../admin/pages/MessagesPage"));
const ChangePasswordPage = lazy(() =>
  import("../admin/pages/ChangePasswordPage")
);

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-navy-950 p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return (
    <Suspense fallback={<AdminSectionSkeleton />}>
      <Outlet />
    </Suspense>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-navy-950 p-6">
                <div className="w-full max-w-md space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            }
          >
            <Login />
          </Suspense>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <PortfolioDataProvider>
              <AdminLayout />
            </PortfolioDataProvider>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AdminDashboardSkeleton />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="sections/meta" element={<MetaPage />} />
          <Route path="sections/personal" element={<PersonalPage />} />
          <Route path="sections/hero" element={<HeroPage />} />
          <Route path="sections/about" element={<AboutPage />} />
          <Route
            path="sections/personalInfoCard"
            element={<PersonalInfoCardPage />}
          />
          <Route path="sections/skills" element={<SkillsPage />} />
          <Route path="sections/contact" element={<ContactPage />} />
          <Route path="sections/resume" element={<ResumePage />} />
          <Route path="sections/stats" element={<StatsPage />} />
          <Route path="sections/education" element={<EducationPage />} />
          <Route path="sections/projects" element={<ProjectsPage />} />
          <Route path="sections/experience" element={<ExperiencePage />} />
          <Route
            path="sections/certifications"
            element={<CertificationsPage />}
          />
          <Route path="sections/blogs" element={<BlogsPage />} />
          <Route path="sections/badges" element={<BadgesPage />} />
          <Route path="sections/hobbies" element={<HobbiesPage />} />
          <Route path="sections/languages" element={<LanguagesPage />} />
          <Route path="sections/socials" element={<SocialsPage />} />
          <Route path="sections/nav" element={<NavPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
