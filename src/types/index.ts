/**
 * Shared Types and Interfaces
 */

// Theme Type
export type Theme = 'light' | 'dark';

// Lead Status
export type LeadStatus = 'NEW' | 'CONTACTED' | 'PROPOSAL' | 'ON_HOLD' | 'WON' | 'LOST';

// Lead Status Color Map
export const leadStatusColors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    CONTACTED: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
    PROPOSAL: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    ON_HOLD: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
    WON: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800',
    LOST: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
};

// Lead Object
export interface Lead {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: LeadStatus;
    source: string | null;
    value: number | null;
    nextFollowUpAt: string | null;
    notes: string | null;
    lostReason: string | null;
    createdAt: string;
    updatedAt: string;
}

// Create Lead Payload
export interface CreateLeadPayload {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    notes?: string;
}

// Update Lead Payload
export interface UpdateLeadPayload {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    status?: LeadStatus;
    lostReason?: string;
    nextFollowUpAt?: string;
    notes?: string;
}

// API Response Format
export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
    totalLeads: number;
    leadsByStatus: Record<LeadStatus, number>;
    overdueFollowups: number;
    upcomingFollowups: number;
    winRate: number;
    averageTimeToWin: number;
}

// Dashboard Metrics (for the dashboard page display)
export interface DashboardMetrics {
    totalLeads: number;
    totalLeadsGrowth: number;
    activeDeals: number;
    activeDealsGrowth: number;
    wonDeals: number;
    wonDealsGrowth: number;
    lostDeals: number;
    lostDealsGrowth: number;
    overdueCount: number;
}

// Leads by Status Chart
export interface LeadByStatusChart {
    active: number;
    new: number;
    qualified: number;
    proposal: number;
    negotiation: number;
}

// Leads by Source Chart
export interface LeadBySourceChart {
    website: number;
    referral: number;
    coldCall: number;
    social: number;
    direct: number;
}

// Lead Source Summary
export interface LeadSourceSummary {
    source: string;
    count: number;
}

// User
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    initials: string;
}

// Activity
export interface ActivityItem {
    id: string;
    type: 'lead' | 'deal' | 'followup' | 'report';
    actor: string;
    actorInitials: string;
    actorColor: string;
    action: string;
    target?: string;
    status?: 'won' | 'lost' | 'pending';
    timestamp: Date;
}

// API Error Response
export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: string;
}

// Health Check Response
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
}

// Filter Parameters
export interface LeadFilterParams {
    page?: number;
    limit?: number;
    status?: LeadStatus;
    source?: string;
    search?: string;
    isOverdue?: boolean;
    sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'nextFollowUpAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}
