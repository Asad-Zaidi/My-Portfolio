import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";

// Code-split the admin dashboard so its editor/auth/routing code never
// ships in the public portfolio bundle unless someone visits /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function AdminFallback() {
  return <div className="min-h-screen bg-navy-950" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
