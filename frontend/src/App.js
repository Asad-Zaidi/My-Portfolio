import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AttributionWatermark from "./components/AttributionWatermark";
import { ToastProvider } from "./components/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminRoutes from "./routes/AdminRoutes";
import AppRouter from "./routes/AppRouter";

function AdminRouteShell() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter adminElement={<AdminRouteShell />} />
        <AttributionWatermark />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

