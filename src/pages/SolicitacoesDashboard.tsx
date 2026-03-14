import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { RequestDashboard } from '@/components/requests/RequestDashboard';
import { useRequests } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { useRequestPermissions } from '@/hooks/useRequestPermissions';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RequestFilters } from '@/types/request';

export default function SolicitacoesDashboard() {
  const navigate = useNavigate();
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
      <PageHeader
        title="Dashboard de Solicitações"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/solicitacoes')}>
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        }
      />
      <RequestDashboard requests={visibleAll} onFilterChange={handleDashboardFilter} />
    </div>
  );
}
