import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { RequestDashboard } from '@/components/requests/RequestDashboard';
import { useRequests } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { useRequestPermissions } from '@/hooks/useRequestPermissions';
import type { RequestFilters } from '@/types/request';

export default function SolicitacoesDashboard() {
  const [filters, setFilters] = useState<RequestFilters>({});
  const { data: allRequests } = useRequests({});
  const user = useUIStore((s) => s.user);
  const permissions = useRequestPermissions(user?.role, user?.id);

  const visibleAll = useMemo(() => {
    if (permissions.canViewAllRequests || !user) return allRequests ?? [];
    return (allRequests ?? []).filter((r) => r.requesterId === user.id);
  }, [allRequests, permissions.canViewAllRequests, user]);

  const handleDashboardFilter = (f: Partial<RequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...f }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <RequestDashboard requests={visibleAll} onFilterChange={handleDashboardFilter} />
    </div>
  );
}
