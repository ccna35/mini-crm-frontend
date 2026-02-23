import { Search, Bell, Moon, Sun, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useThemeStore, useUIStore } from "@stores/dashboardStore";
import { cn } from "@utils/helpers";

const pageConfig: Record<
  string,
  { title: string; breadcrumbs: { label: string; active?: boolean }[] }
> = {
  "/dashboard": {
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard", active: true }],
  },
  "/leads": {
    title: "Leads",
    breadcrumbs: [
      { label: "Dashboard" },
      { label: "Leads Management", active: true },
    ],
  },
  "/sources": {
    title: "Lead Sources",
    breadcrumbs: [
      { label: "Dashboard" },
      { label: "Lead Sources", active: true },
    ],
  },
  "/follow-ups": {
    title: "Follow-Ups",
    breadcrumbs: [
      { label: "Dashboard" },
      { label: "Follow-Ups", active: true },
    ],
  },
  "/reports": {
    title: "Reports",
    breadcrumbs: [{ label: "Dashboard" }, { label: "Reports", active: true }],
  },
  "/settings": {
    title: "Settings",
    breadcrumbs: [{ label: "Dashboard" }, { label: "Settings", active: true }],
  },
};

export function Header() {
  const theme = useThemeStore((state: any) => state.theme);
  const toggleTheme = useThemeStore((state: any) => state.toggleTheme);
  const searchQuery = useUIStore((state: any) => state.searchQuery);
  const setSearchQuery = useUIStore((state: any) => state.setSearchQuery);
  const location = useLocation();

  const currentPage = pageConfig[location.pathname] || pageConfig["/dashboard"];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {currentPage.title}
        </h2>
        <div className="flex items-center text-xs text-slate-400 font-medium">
          {currentPage.breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <span
                className={cn(
                  crumb.active
                    ? "text-primary"
                    : "text-slate-400 dark:text-slate-500",
                )}
              >
                {crumb.label}
              </span>
              {index < currentPage.breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 mx-1" />
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search leads, deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg",
              "focus:ring-2 focus:ring-primary focus:outline-none w-64 text-sm transition-all",
              "text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400",
            )}
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
          <Bell
            size={20}
            className="group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
          />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => toggleTheme()}
          className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <Moon
              size={20}
              className="group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
            />
          ) : (
            <Sun
              size={20}
              className="group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"
            />
          )}
        </button>
      </div>
    </header>
  );
}
