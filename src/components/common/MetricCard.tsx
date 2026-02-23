import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@utils/helpers";

interface MetricCardProps {
  title: string;
  value: number | string;
  growth?: number;
  loading?: boolean;
  variant?: "default" | "primary" | "danger";
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  growth,
  loading = false,
  variant = "default",
  icon,
}: MetricCardProps) {
  const isPositive = (growth ?? 0) >= 0;
  const showAlert = variant === "danger" && (growth ?? 0) < 0;

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm",
        "hover:shadow-md transition-shadow",
        variant === "danger"
          ? "border-red-200 dark:border-red-900 relative overflow-hidden group"
          : "border-slate-200 dark:border-slate-800",
      )}
    >
      {/* Background decoration for danger variant */}
      {variant === "danger" && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 -mr-4 -mt-4 rounded-full group-hover:scale-150 transition-transform"></div>
      )}

      <p
        className={cn(
          "text-sm font-medium mb-1",
          variant === "default" && "text-slate-500 dark:text-slate-400",
          variant === "primary" && "text-slate-500 dark:text-slate-400",
          variant === "danger" && "text-slate-500 dark:text-slate-400",
        )}
      >
        {title}
      </p>

      <div className="flex items-end justify-between gap-4 relative z-10">
        <div className="flex flex-col">
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ) : (
            <h3
              className={cn(
                "text-3xl font-bold",
                variant === "default" && "text-slate-900 dark:text-white",
                variant === "primary" && "text-primary",
                variant === "danger" && "text-red-600 dark:text-red-400",
              )}
            >
              {value}
            </h3>
          )}
        </div>

        {showAlert ? (
          <div className="flex items-center gap-1">
            <TrendingDown size={16} className="text-red-500 animate-pulse" />
          </div>
        ) : growth !== undefined && growth !== null ? (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap",
              isPositive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
            )}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(growth)}%
          </span>
        ) : (
          icon && <div className="text-3xl opacity-50">{icon}</div>
        )}
      </div>
    </div>
  );
}
