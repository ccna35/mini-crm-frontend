import type { LeadByStatusChart } from "../../types";
import { cn } from "@utils/helpers";

interface LeadsByStatusChartProps {
  data?: LeadByStatusChart;
  loading?: boolean;
}

export function LeadsByStatusChart({ data, loading }: LeadsByStatusChartProps) {
  const total = data
    ? data.new + data.qualified + data.proposal + data.negotiation + data.active
    : 0;

  const chartData = data
    ? [
        {
          label: "New",
          value: data.new,
          percentage: (data.new / total) * 100,
          color: "stroke-primary",
        },
        {
          label: "Qualified",
          value: data.qualified,
          percentage: (data.qualified / total) * 100,
          color: "stroke-teal-400",
        },
        {
          label: "Proposal",
          value: data.proposal,
          percentage: (data.proposal / total) * 100,
          color: "stroke-amber-500",
        },
        {
          label: "Negotiation",
          value: data.negotiation,
          percentage: (data.negotiation / total) * 100,
          color: "stroke-slate-400",
        },
      ]
    : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
          Leads by Status
        </h4>
        <button className="text-xs text-slate-500 hover:text-primary font-semibold flex items-center gap-1 transition-colors">
          Last 30 days
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-12 py-8">
          <div className="w-48 h-48 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          <div className="space-y-3 w-40">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-12 py-4">
          {/* Donut Chart */}
          <div className="relative w-48 h-48">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <circle
                className="stroke-slate-100 dark:stroke-slate-800"
                cx="18"
                cy="18"
                fill="none"
                r="15.915"
                strokeWidth="3"
              ></circle>
              {chartData.map((item, index) => {
                const offset = chartData
                  .slice(0, index)
                  .reduce((acc, d) => acc + d.percentage, 0);
                return (
                  <circle
                    key={item.label}
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke={
                      item.label === "New"
                        ? "#136dec"
                        : item.label === "Qualified"
                          ? "#2dd4bf"
                          : item.label === "Proposal"
                            ? "#f59e0b"
                            : "#94a3b8"
                    }
                    strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                    strokeDashoffset={-offset}
                    strokeWidth="3"
                  ></circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {data?.active || 0}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Active
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-3 h-3 rounded-full",
                    item.color === "stroke-primary" && "bg-primary",
                    item.color === "stroke-teal-400" && "bg-teal-400",
                    item.color === "stroke-amber-500" && "bg-amber-500",
                    item.color === "stroke-slate-400" && "bg-slate-400",
                  )}
                ></span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {item.label} ({Math.round(item.percentage)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
