import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FlaskConical,
  GitCompareArrows,
  TestTube,
  FileBarChart,
  Settings,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/evaluations", icon: FlaskConical, label: "Evaluations" },
  { to: "/comparison", icon: GitCompareArrows, label: "Comparison" },
  { to: "/test-cases", icon: TestTube, label: "Test Cases" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { state, toggleSidebar } = useApp();
  const open = state.sidebarOpen;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300",
          open ? "w-64" : "w-[72px]",
          "max-lg:translate-x-0",
          !open && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200 dark:shadow-indigo-950">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {open && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Evalora
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 text-indigo-700 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )}
                  />
                  {open && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 hidden lg:block">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all cursor-pointer",
            )}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                !open && "rotate-180"
              )}
            />
            {open && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
