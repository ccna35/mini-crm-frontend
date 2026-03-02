import { useState } from "react";
import { useLeadsList } from "@hooks/useQueries";
import { useDashboardMetrics } from "@hooks/useQueries";
import { useLeadSources } from "@hooks/useQueries";
import type { LeadStatus, Lead } from "../types";
import {
  getInitials,
  formatCurrency,
  formatDate,
  formatFollowUpDate,
  getAvatarColor,
} from "@utils/helpers";
import { leadStatusColors } from "../types";
import {
  Download,
  Plus,
  ChevronDown,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AddLeadModal } from "./modals/AddLeadModal";
import { EditLeadModal } from "./modals/EditLeadModal";

export function LeadsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "name">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { data, isLoading, isError } = useLeadsList({
    page,
    limit,
    ...(statusFilter && { status: statusFilter }),
    ...(sourceFilter && { source: sourceFilter }),
    sortBy,
    sortOrder,
  });

  const { data: metrics } = useDashboardMetrics();
  const { data: leadSources } = useLeadSources();

  const leads = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const totalLeadValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value) || 0),
    0,
  );

  return (
    <div className="flex-1 overflow-auto p-8 space-y-6">
      {/* Page Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Leads Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Showing {total} total leads in your current sales pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-4 min-w-[300px]">
          <div className="w-full max-w-xs relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as LeadStatus | "");
                setPage(1);
              }}
              className="w-full pl-3 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Status: All Leads</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="w-full max-w-xs relative">
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-3 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Source: All Sources</option>
              {(leadSources || []).map((item) => (
                <option key={item.source} value={item.source}>
                  {item.source}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            Sort by:
          </span>
          <button
            onClick={() => {
              setSortBy("createdAt");
              setSortOrder(sortOrder === "desc" ? "asc" : "desc");
            }}
            className="flex items-center gap-1 text-sm font-semibold text-primary px-2 py-1 bg-primary/5 rounded"
          >
            {sortBy === "createdAt" ? "Recently Created" : "Custom Sort"}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Name &amp; Company
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lead Value
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Next Follow-up
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2">Loading leads...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-red-500"
                  >
                    Error loading leads. Please try again.
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No leads found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const followUp = formatFollowUpDate(lead.nextFollowUpAt);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(
                              lead.status,
                            )}`}
                          >
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {lead.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lead.company || "No company"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{lead.email || "-"}</div>
                        <div className="text-xs text-slate-500">
                          {lead.phone || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            leadStatusColors[lead.status]
                          }`}
                        >
                          {lead.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {lead.status === "WON" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : lead.status === "LOST" ? (
                          <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : (
                          <>
                            <div
                              className={`text-sm font-medium ${
                                followUp.isOverdue ? "text-red-500" : ""
                              }`}
                            >
                              {followUp.label}
                            </div>
                            {followUp.time && (
                              <div className="text-[10px] text-slate-400">
                                {followUp.time}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                          title="Edit lead"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-medium">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) =>
                typeof pageNum === "number" ? (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${
                      page === pageNum
                        ? "bg-primary text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ) : (
                  <span key={idx} className="px-1 text-slate-400">
                    {pageNum}
                  </span>
                ),
              )}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Value
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black">
              {formatCurrency(totalLeadValue)}
            </span>
            <span className="text-xs text-green-500 font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Conversion Rate
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black">
              {metrics
                ? Math.round(
                    (metrics.wonDeals /
                      (metrics.wonDeals + metrics.lostDeals || 1)) *
                      100,
                  )
                : 0}
              %
            </span>
            <span className="text-xs text-red-500 font-bold">-2.1%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Deals
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black">
              {metrics?.activeDeals || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              of {total} leads
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Response Time
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black">2.4h</span>
            <span className="text-xs text-green-500 font-bold">Fast</span>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Lead Modal */}
      {editingLead && (
        <EditLeadModal
          isOpen={!!editingLead}
          onClose={() => setEditingLead(null)}
          lead={editingLead}
        />
      )}
    </div>
  );
}
