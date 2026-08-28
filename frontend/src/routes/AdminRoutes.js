import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  LuLoaderCircle as Loader2,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../admin/components/AdminLayout";
import Login from "../admin/pages/Login";
import Dashboard from "../admin/pages/Dashboard";
import MetaPage from "../admin/pages/sections/MetaPage";
import PersonalPage from "../admin/pages/sections/PersonalPage";
import HeroPage from "../admin/pages/sections/HeroPage";
import AboutPage from "../admin/pages/sections/AboutPage";
import PersonalInfoCardPage from "../admin/pages/sections/PersonalInfoCardPage";
import SkillsPage from "../admin/pages/sections/SkillsPage";
import ContactPage from "../admin/pages/sections/ContactPage";
import ResumePage from "../admin/pages/sections/ResumePage";
import StatsPage from "../admin/pages/sections/StatsPage";
import EducationPage from "../admin/pages/sections/EducationPage";
import ExperiencePage from "../admin/pages/sections/ExperiencePage";
import CertificationsPage from "../admin/pages/sections/CertificationsPage";
import BlogsPage from "../admin/pages/sections/BlogsPage";
import BadgesPage from "../admin/pages/sections/BadgesPage";
import HobbiesPage from "../admin/pages/sections/HobbiesPage";
import LanguagesPage from "../admin/pages/sections/LanguagesPage";
import SocialsPage from "../admin/pages/sections/SocialsPage";
import NavPage from "../admin/pages/sections/NavPage";
import MessagesPage from "../admin/pages/MessagesPage";
import { PortfolioDataProvider } from "../context/PortfolioDataContext";

function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-400">
				<Loader2 className="h-6 w-6" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/admin/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
}

export default function AdminRoutes() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />

			<Route element={<ProtectedRoute />}>
				<Route
					element={
						<PortfolioDataProvider>
							<AdminLayout />
						</PortfolioDataProvider>
					}
				>
					<Route index element={<Dashboard />} />
					<Route path="sections/meta" element={<MetaPage />} />
					<Route path="sections/personal" element={<PersonalPage />} />
					<Route path="sections/hero" element={<HeroPage />} />
					<Route path="sections/about" element={<AboutPage />} />
					<Route path="sections/personalInfoCard" element={<PersonalInfoCardPage />} />
					<Route path="sections/skills" element={<SkillsPage />} />
					<Route path="sections/contact" element={<ContactPage />} />
					<Route path="sections/resume" element={<ResumePage />} />
					<Route path="sections/stats" element={<StatsPage />} />
					<Route path="sections/education" element={<EducationPage />} />
					<Route path="sections/experience" element={<ExperiencePage />} />
					<Route path="sections/certifications" element={<CertificationsPage />} />
					<Route path="sections/blogs" element={<BlogsPage />} />
					<Route path="sections/badges" element={<BadgesPage />} />
					<Route path="sections/hobbies" element={<HobbiesPage />} />
					<Route path="sections/languages" element={<LanguagesPage />} />
					<Route path="sections/socials" element={<SocialsPage />} />
					<Route path="sections/nav" element={<NavPage />} />
					<Route path="messages" element={<MessagesPage />} />
				</Route>
			</Route>
		</Routes>
	);
}
