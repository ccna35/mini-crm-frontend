import {
  Grid3x3,
  FileText,
  History,
  BarChart3,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUIStore, useUserStore } from "@stores/dashboardStore";
import { cn } from "@utils/helpers";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function Sidebar() {
  const sidebarOpen = useUIStore((state: any) => state.sidebarOpen);
  const user = useUserStore((state: any) => state.user);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: <Grid3x3 size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <FileText size={20} />,
      label: "Leads",
      href: "/leads",
    },
    {
      icon: <History size={20} />,
      label: "Follow-Ups",
      href: "/follow-ups",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center shrink-0">
          <Grid3x3 size={24} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Mini CRM
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
            !sidebarOpen && "justify-center",
          )}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0 font-bold text-primary text-sm">
            {user?.initials || "AR"}
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                  {user?.name || "Alex Rivera"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.role || "Sales Manager"}
                </p>
              </div>
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
