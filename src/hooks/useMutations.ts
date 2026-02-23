import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@services/api';
import type { CreateLeadPayload, UpdateLeadPayload } from '../types';
import { dashboardQueryKeys, leadsQueryKeys } from './useQueries';

// Create Lead Mutation
export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateLeadPayload) => leadsApi.createLead(payload),
        onSuccess: () => {
            // Invalidate all dashboard and leads queries to refetch data
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });
        },
        onError: (error) => {
            console.error('Failed to create lead:', error);
        },
    });
}

// Update Lead Mutation
export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
            leadsApi.updateLead(id, payload),
        onSuccess: () => {
            // Invalidate all dashboard and leads queries
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });
        },
        onError: (error) => {
            console.error('Failed to update lead:', error);
        },
    });
}

// Delete Lead Mutation
export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leadsApi.deleteLead(id),
        onSuccess: () => {
            // Invalidate all dashboard and leads queries
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });
        },
        onError: (error) => {
            console.error('Failed to delete lead:', error);
        },
    });
}

// Get leads list query (for the Leads page with filtering)
export function useLeadsList(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}) {
    const queryClient = useQueryClient();

    return {
        query: queryClient.fetchQuery({
            queryKey: ['leads', 'list', params],
            queryFn: () => leadsApi.getLeads(params as any),
            staleTime: 1 * 60 * 1000, // 1 minute
        }),
    };
}

// Get single lead query (for the Lead Detail page)
export function useLeadDetail(id: string) {
    const queryClient = useQueryClient();

    return {
        query: queryClient.fetchQuery({
            queryKey: ['leads', 'detail', id],
            queryFn: () => leadsApi.getLead(id),
            staleTime: 2 * 60 * 1000, // 2 minutes
        }),
    };
}
