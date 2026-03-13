import { useQuery } from '@tanstack/react-query';
import { getMockActivities } from '@/data/mock-activities';
import type { ActivityFilters, ActivityPagination } from '@/types/activity';
import { matchesFilter } from '@/lib/utils';

export function useActivityLogs(filters: ActivityFilters, pagination: ActivityPagination) {
  return useQuery({
    queryKey: ['activities', filters, pagination],
    queryFn: () => {
      let data = getMockActivities();
      if (filters.search) {
        const s = filters.search.toLowerCase();
        data = data.filter(a => (a.entityName?.toLowerCase().includes(s)) || a.userName.toLowerCase().includes(s) || JSON.stringify(a.details || {}).toLowerCase().includes(s));
      }
      if (filters.entityTypes?.length) data = data.filter(a => filters.entityTypes!.includes(a.entityType));
      data = data.filter(a => matchesFilter(a.userId, filters.userId));
      if (filters.startDate) data = data.filter(a => a.createdAt >= filters.startDate!);
      if (filters.endDate) data = data.filter(a => a.createdAt <= filters.endDate! + 'T23:59:59Z');

      data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const total = data.length;
      const start = (pagination.page - 1) * pagination.pageSize;
      const items = data.slice(start, start + pagination.pageSize);
      return { items, total, totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)) };
    },
  });
}

export function useActivitySummary(filters: ActivityFilters) {
  return useQuery({
    queryKey: ['activity-summary', filters],
    queryFn: () => {
      let data = getMockActivities();
      if (filters.startDate) data = data.filter(a => a.createdAt >= filters.startDate!);
      if (filters.endDate) data = data.filter(a => a.createdAt <= filters.endDate! + 'T23:59:59Z');

      const byUser: Record<string, { name: string; count: number }> = {};
      const byEntity: Record<string, number> = {};
      data.forEach(a => {
        if (!byUser[a.userId]) byUser[a.userId] = { name: a.userName, count: 0 };
        byUser[a.userId].count++;
        byEntity[a.entityType] = (byEntity[a.entityType] || 0) + 1;
      });

      const topUsers = Object.entries(byUser).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.count - a.count).slice(0, 10);
      const topEntities = Object.entries(byEntity).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

      return { topUsers, topEntities };
    },
  });
}
