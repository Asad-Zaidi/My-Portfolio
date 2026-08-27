import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SectionPage from "./pages/SectionPage";
import MessagesPage from "./pages/MessagesPage";

// Admin always renders in the site's dark theme, independent of whatever
// the public visitor last chose — a CMS dashboard reads better fixed-dark,
// and it reuses the exact navy/accent tokens from tailwind.config.js.
function ForceDarkTheme() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }, []);
  return null;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ForceDarkTheme />
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
              <Route path="sections/:sectionKey" element={<SectionPage />} />
              <Route path="messages" element={<MessagesPage />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
