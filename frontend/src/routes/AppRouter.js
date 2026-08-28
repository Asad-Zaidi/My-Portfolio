import { Route, Routes } from "react-router-dom";
import Portfolio from "../pages/Portfolio";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
 
import AdminRoutes from "./AdminRoutes";

export default function AppRouter({ adminElement = <AdminRoutes /> }) {
	return (
		<Routes>
			<Route path="/" element={<Portfolio />} />
			<Route path="/blogs" element={<Blogs />} />
			<Route path="/blogs/:slug" element={<BlogDetail />} />
			<Route
				path="/admin/*"
				element={adminElement}
			/>
		</Routes>
	);
}
