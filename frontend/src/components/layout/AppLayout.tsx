import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils";

export function AppLayout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen transition-all duration-300 p-6 lg:p-8",
          state.sidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
