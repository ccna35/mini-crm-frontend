import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Format large numbers (e.g., 1240 -> 1.2K)
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
}

/**
 * Format time ago (e.g., 2 minutes ago)
 */
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
        return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Format currency (USD)
 */
export function formatCurrency(value: number | null): string {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format follow-up date (relative or absolute)
 */
export function formatFollowUpDate(dateString: string | null): {
    label: string;
    time?: string;
    isOverdue: boolean;
} {
    if (!dateString) {
        return { label: '-', isOverdue: false };
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Overdue
    if (diffMs < 0) {
        return {
            label: 'Overdue',
            time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isOverdue: true,
        };
    }

    // Today
    if (diffDays === 0) {
        return {
            label: 'Today',
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOverdue: false,
        };
    }

    // Tomorrow
    if (diffDays === 1) {
        return {
            label: 'Tomorrow',
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOverdue: false,
        };
    }

    // This week (next 7 days)
    if (diffDays < 7) {
        return {
            label: date.toLocaleDateString('en-US', { weekday: 'long' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOverdue: false,
        };
    }

    // Next week
    if (diffDays < 14) {
        return {
            label: 'Next Week',
            time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isOverdue: false,
        };
    }

    // Absolute date
    return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isOverdue: false,
    };
}

/**
 * Get avatar color based on status
 */
export function getAvatarColor(status: string): string {
    const colors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-600',
        CONTACTED: 'bg-slate-100 text-slate-600',
        PROPOSAL: 'bg-amber-100 text-amber-600',
        ON_HOLD: 'bg-purple-100 text-purple-600',
        WON: 'bg-green-100 text-green-600',
        LOST: 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
}
