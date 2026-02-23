import { Link } from "react-router-dom";
import type { LeadSourceSummary } from "../../types";

interface LeadsBySourceChartProps {
  data?: LeadSourceSummary[];
  loading?: boolean;
}

export function LeadsBySourceChart({ data, loading }: LeadsBySourceChartProps) {
  const MAX_VISIBLE = 5;
  const sortedData = [...(data || [])].sort((a, b) => b.count - a.count);
  const chartData = sortedData
    .slice(0, MAX_VISIBLE)
    .map((item) => ({ name: item.source, value: item.count }));
  const hasMore = sortedData.length > MAX_VISIBLE;

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
          Leads by Source
        </h4>
        <div className="flex gap-2 items-center">
          {hasMore ? (
            <Link
              to="/sources"
              className="text-xs text-primary hover:text-primary/80 font-semibold"
            >
              View all
            </Link>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Lead Count
              </span>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-end justify-between gap-4 h-48 px-4">
          {Array.from({ length: MAX_VISIBLE }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t-lg animate-pulse"
              style={{ height: "50%" }}
            ></div>
          ))}
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          No source data available.
        </div>
      ) : (
        <div className="h-48 px-4">
          <div className="flex h-full items-end justify-between gap-4">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex-1 h-full flex flex-col justify-end"
              >
                <div className="flex-1 flex items-end">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all hover:brightness-110"
                    style={{
                      height: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                    }}
                    title={`${item.name}: ${item.value}`}
                  ></div>
                </div>
                <span className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium text-center truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
