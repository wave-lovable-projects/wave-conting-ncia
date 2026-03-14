import { PageHeader } from '@/components/shared/PageHeader';
import { MetaConnectionStatus } from '@/components/meta/MetaConnectionStatus';
import { MetaAlerts } from '@/components/meta/MetaAlerts';
import { useMetaAuthStatus } from '@/hooks/useMeta';

export default function MetaDashboard() {
  const { data: auth } = useMetaAuthStatus();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Meta" description="Visão geral da integração com a Meta Marketing API" />
      <MetaConnectionStatus />
      {auth?.connected && <MetaAlerts />}
    </div>
  );
}
