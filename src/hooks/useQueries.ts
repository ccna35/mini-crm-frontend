import { useQuery } from '@tanstack/react-query';
import { leadsApi, statsToDashboardMetrics } from '@services/api';
import type { Lead, LeadFilterParams } from '../types';

// Query keys
export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
    metrics: () => [...dashboardQueryKeys.all, 'metrics'] as const,
    leads: () => [...dashboardQueryKeys.all, 'leads'] as const,
    sources: () => [...dashboardQueryKeys.all, 'sources'] as const,
    activity: () => [...dashboardQueryKeys.all, 'activity'] as const,
    overdue: () => [...dashboardQueryKeys.all, 'overdue'] as const,
    upcoming: () => [...dashboardQueryKeys.all, 'upcoming'] as const,
};

export const leadsQueryKeys = {
    all: ['leads'] as const,
    lists: () => [...leadsQueryKeys.all, 'list'] as const,
    list: (params?: LeadFilterParams) => [...leadsQueryKeys.lists(), params] as const,
    details: () => [...leadsQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...leadsQueryKeys.details(), id] as const,
    sources: () => [...leadsQueryKeys.all, 'sources'] as const,
};

// Dashboard Metrics Hook - using real API
export function useDashboardMetrics() {
    return useQuery({
        queryKey: dashboardQueryKeys.metrics(),
        queryFn: async () => {
            const stats = await leadsApi.getDashboardStats();
            return statsToDashboardMetrics(stats);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
}

// Leads by Status Hook
export function useLeadsByStatus() {
    return useQuery({
        queryKey: dashboardQueryKeys.stats(),
        queryFn: async () => {
            const stats = await leadsApi.getDashboardStats();
            return {
                active: stats.totalLeads - stats.leadsByStatus.WON - stats.leadsByStatus.LOST,
                new: stats.leadsByStatus.NEW + stats.leadsByStatus.CONTACTED,
                qualified: stats.leadsByStatus.PROPOSAL + stats.leadsByStatus.ON_HOLD,
                proposal: stats.leadsByStatus.PROPOSAL,
                negotiation: stats.leadsByStatus.ON_HOLD,
            };
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
}

// Leads by Source Hook
export function useLeadsBySource() {
    return useQuery({
        queryKey: dashboardQueryKeys.sources(),
        queryFn: () => leadsApi.getSources(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
}

// Recent Activity Hook
export function useRecentActivity() {
    return useQuery({
        queryKey: dashboardQueryKeys.activity(),
        queryFn: async () => {
            // Get recent leads and format as activity
            const { data: leads } = await leadsApi.getLeads({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' });
            return leads.map((lead: Lead) => ({
                id: lead.id,
                type: 'lead' as const,
                actor: 'System',
                actorInitials: 'S',
                actorColor: 'bg-slate-50 dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-700',
                action: `updated lead: ${lead.name}`,
                target: lead.company || lead.email || 'Unknown',
                status: lead.status === 'WON' ? 'won' : lead.status === 'LOST' ? 'lost' : 'pending' as any,
                timestamp: new Date(lead.updatedAt),
            }));
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
}

// Overdue Followups Hook
export function useOverdueFollowups() {
    return useQuery({
        queryKey: dashboardQueryKeys.overdue(),
        queryFn: () => leadsApi.getOverdueFollowups(),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
}

// Upcoming Followups Hook
export function useUpcomingFollowups() {
    return useQuery({
        queryKey: dashboardQueryKeys.upcoming(),
        queryFn: () => leadsApi.getUpcomingFollowups(),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
}

// Leads List Hook (for Leads Page with filters and pagination)
export function useLeadsList(params?: LeadFilterParams) {
    return useQuery({
        queryKey: leadsQueryKeys.list(params),
        queryFn: () => leadsApi.getLeads(params),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
}

// Lead Sources Hook (for source filtering dropdown)
export function useLeadSources() {
    return useQuery({
        queryKey: leadsQueryKeys.sources(),
        queryFn: () => leadsApi.getSources(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
}

// Single Lead Detail Hook
export function useLeadDetail(id: string, enabled = true) {
    return useQuery({
        queryKey: leadsQueryKeys.detail(id),
        queryFn: () => leadsApi.getLead(id),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        enabled,
    });
}
