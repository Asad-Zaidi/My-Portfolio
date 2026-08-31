import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PortfolioSkeleton from "../components/skeletons/PortfolioSkeleton";
import BlogsSkeleton from "../components/skeletons/BlogsSkeleton";
import BlogDetailSkeleton from "../components/skeletons/BlogDetailSkeleton";

// Route-level code-splitting with React.lazy
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Blogs = lazy(() => import("../pages/Blogs"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));

export default function AppRouter({ adminElement }) {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Suspense fallback={<PortfolioSkeleton />}>
						<Portfolio />
					</Suspense>
				}
			/>
			<Route
				path="/blogs"
				element={
					<Suspense fallback={<BlogsSkeleton />}>
						<Blogs />
					</Suspense>
				}
			/>
			<Route
				path="/blogs/:slug"
				element={
					<Suspense fallback={<BlogDetailSkeleton />}>
						<BlogDetail />
					</Suspense>
				}
			/>
			<Route
				path="/admin/*"
				element={
					adminElement || (
						<Suspense fallback={<PortfolioSkeleton />}>
							<AdminRoutes />
						</Suspense>
					)
				}
			/>
		</Routes>
	);
}
