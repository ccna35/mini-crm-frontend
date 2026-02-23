import { AlertCircle } from "lucide-react";
import {
  useDashboardMetrics,
  useLeadsByStatus,
  useLeadsBySource,
  useRecentActivity,
} from "@hooks/useQueries";
import { MetricCard } from "./common/MetricCard";
import { LeadsByStatusChart } from "./common/LeadsByStatusChart";
import { LeadsBySourceChart } from "./common/LeadsBySourceChart";
import { RecentActivity } from "./common/RecentActivity";

export function Dashboard() {
  const metrics = useDashboardMetrics();
  const leadsByStatus = useLeadsByStatus();
  const leadsBySource = useLeadsBySource();
  const recentActivity = useRecentActivity();

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.data?.totalLeads ?? 0}
          growth={metrics.data?.totalLeadsGrowth}
          loading={metrics.isLoading}
        />
        <MetricCard
          title="Active Deals"
          value={metrics.data?.activeDeals ?? 0}
          growth={metrics.data?.activeDealsGrowth}
          loading={metrics.isLoading}
          variant="primary"
        />
        <MetricCard
          title="Won Deals"
          value={metrics.data?.wonDeals ?? 0}
          growth={metrics.data?.wonDealsGrowth}
          loading={metrics.isLoading}
        />
        <MetricCard
          title="Lost Deals"
          value={metrics.data?.lostDeals ?? 0}
          growth={metrics.data?.lostDealsGrowth}
          loading={metrics.isLoading}
        />
        <MetricCard
          title="Overdue"
          value={metrics.data?.overdueCount ?? 0}
          loading={metrics.isLoading}
          variant="danger"
          icon={<AlertCircle />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeadsByStatusChart
          data={leadsByStatus.data}
          loading={leadsByStatus.isLoading}
        />
        <LeadsBySourceChart
          data={leadsBySource.data}
          loading={leadsBySource.isLoading}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity
        activities={recentActivity.data}
        loading={recentActivity.isLoading}
      />
    </div>
  );
}
