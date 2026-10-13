import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./pages/Dashboard";
import EvaluationsPage from "./pages/Evaluations";
import ModelComparisonPage from "./pages/ModelComparison";
import TestCasesPage from "./pages/TestCases";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/comparison" element={<ModelComparisonPage />} />
            <Route path="/test-cases" element={<TestCasesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
