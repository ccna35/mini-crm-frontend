import { useMemo } from "react";
import { useLeadSources } from "@hooks/useQueries";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function SourcesPage() {
  const { data, isLoading, isError } = useLeadSources();

  const sortedSources = useMemo(() => {
    return [...(data || [])].sort((a, b) => b.count - a.count);
  }, [data]);

  const total = sortedSources.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Lead Sources</h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete breakdown of all sources and lead counts.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            All Sources
          </h2>
          <span className="text-xs text-slate-500">
            {sortedSources.length} sources
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading sources...</div>
        ) : isError ? (
          <div className="p-6 text-sm text-red-500">
            Failed to load sources.
          </div>
        ) : sortedSources.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No sources found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Count
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedSources.map((item) => {
                  const share = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <tr
                      key={item.source}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-slate-700 dark:text-slate-300">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-slate-700 dark:text-slate-300">
                        {share.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
