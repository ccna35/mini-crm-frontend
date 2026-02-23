import axios, { AxiosError } from 'axios';
import type {
    DashboardStats,
    DashboardMetrics,
    Lead,
    LeadSourceSummary,
    CreateLeadPayload,
    UpdateLeadPayload,
    PaginatedResponse,
    ApiResponse,
    LeadFilterParams,
    HealthCheckResponse,
    ApiErrorResponse,
} from '../types';

// API Base URL - Points to NestJS backend
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.debug('[API Request]', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging and error handling
apiClient.interceptors.response.use(
    (response) => {
        console.debug('[API Response]', response.status, response.data);
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        console.error('[API Error]', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

/**
 * API Service Class - Handles all API calls to the NestJS backend
 */
class LeadsApiService {
    /**
     * Health Check
     */
    async healthCheck(): Promise<HealthCheckResponse> {
        try {
            const response = await apiClient.get<ApiResponse<HealthCheckResponse>>('/health');
            return response.data.data;
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    /**
     * Get Dashboard Stats
     */
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Create Lead
     */
    async createLead(payload: CreateLeadPayload): Promise<Lead> {
        try {
            const response = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create lead:', error);
            throw error;
        }
    }

    /**
     * Get Leads with Pagination and Filtering
     */
    async getLeads(params?: LeadFilterParams): Promise<PaginatedResponse<Lead>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Lead>>>('/leads', {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    ...(params?.status && { status: params.status }),
                    ...(params?.source && { source: params.source }),
                    ...(params?.search && { search: params.search }),
                    ...(params?.isOverdue !== undefined && { isOverdue: params.isOverdue }),
                    ...(params?.sortBy && { sortBy: params.sortBy }),
                    ...(params?.sortOrder && { sortOrder: params.sortOrder }),
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch leads:', error);
            throw error;
        }
    }

    /**
     * Get Unique Lead Sources
     */
    async getSources(): Promise<LeadSourceSummary[]> {
        try {
            const response = await apiClient.get<ApiResponse<LeadSourceSummary[]>>('/leads/sources');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch lead sources:', error);
            throw error;
        }
    }

    /**
     * Get Single Lead
     */
    async getLead(id: string): Promise<Lead> {
        try {
            const response = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch lead:', error);
            throw error;
        }
    }

    /**
     * Update Lead
     */
    async updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
        try {
            const response = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
            return response.data.data;
        } catch (error) {
            console.error('Failed to update lead:', error);
            throw error;
        }
    }

    /**
     * Delete Lead
     */
    async deleteLead(id: string): Promise<Lead> {
        try {
            const response = await apiClient.delete<ApiResponse<Lead>>(`/leads/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to delete lead:', error);
            throw error;
        }
    }

    /**
     * Get Overdue Followups
     */
    async getOverdueFollowups(): Promise<Lead[]> {
        try {
            const response = await apiClient.get<ApiResponse<Lead[]>>('/leads/overdue');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch overdue followups:', error);
            throw error;
        }
    }

    /**
     * Get Upcoming Followups
     */
    async getUpcomingFollowups(): Promise<Lead[]> {
        try {
            const response = await apiClient.get<ApiResponse<Lead[]>>('/leads/upcoming');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch upcoming followups:', error);
            throw error;
        }
    }
}

// Convert DashboardStats to DashboardMetrics for display
export function statsToDashboardMetrics(stats: DashboardStats): DashboardMetrics {
    const wonDeals = stats.leadsByStatus.WON;
    const activeDealsCount = Object.entries(stats.leadsByStatus).reduce((acc: number, [status, count]) => {
        if (status === 'WON' || status === 'LOST') {
            return acc;
        }
        return acc + count;
    }, 0);

    return {
        totalLeads: stats.totalLeads,
        totalLeadsGrowth: 12, // This would come from a separate endpoint in real API
        activeDeals: activeDealsCount,
        activeDealsGrowth: 5,
        wonDeals: wonDeals,
        wonDealsGrowth: 8,
        lostDeals: stats.leadsByStatus.LOST,
        lostDealsGrowth: -2,
        overdueCount: stats.overdueFollowups,
    };
}

export const leadsApi = new LeadsApiService();
