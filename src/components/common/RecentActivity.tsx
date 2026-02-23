import { MoreVertical } from "lucide-react";
import type { ActivityItem } from "../../types";
import { formatTimeAgo, cn } from "../../utils/helpers";

interface RecentActivityProps {
  activities?: ActivityItem[];
  loading?: boolean;
}

export function RecentActivity({
  activities = [],
  loading = false,
}: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
          Recent Activity
        </h4>
        <button className="text-sm text-primary font-semibold hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  activity.actorColor,
                )}
              >
                {activity.actorInitials}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                  <span className="font-bold">{activity.actor}</span>{" "}
                  {activity.action}
                  {activity.target && (
                    <>
                      {": "}
                      <span
                        className={cn(
                          "cursor-pointer hover:underline",
                          activity.status === "won"
                            ? "text-green-600 font-bold"
                            : "text-primary",
                        )}
                      >
                        {activity.target}
                      </span>
                    </>
                  )}
                  {activity.status === "won" && (
                    <>
                      {" "}
                      as <span className="text-green-600 font-bold">Won</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>

              <button className="p-1 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <MoreVertical size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
