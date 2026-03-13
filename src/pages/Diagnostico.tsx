import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectionGraph } from '@/components/diagnostics/ConnectionGraph';
import { IncidentTimeline } from '@/components/diagnostics/IncidentTimeline';
import { CorrelationMatrix } from '@/components/diagnostics/CorrelationMatrix';
import { Search, AlertTriangle, Grid3X3 } from 'lucide-react';

export default function Diagnostico() {
  const [tab, setTab] = useState('graph');

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnóstico" subtitle="Grafo de conexões, incidentes e correlações entre ativos" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="graph" className="gap-1.5"><Search className="h-4 w-4" /> Grafo de Conexões</TabsTrigger>
          <TabsTrigger value="incidents" className="gap-1.5"><AlertTriangle className="h-4 w-4" /> Incidentes</TabsTrigger>
          <TabsTrigger value="correlation" className="gap-1.5"><Grid3X3 className="h-4 w-4" /> Correlação</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-4">
          <ConnectionGraph />
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <IncidentTimeline />
        </TabsContent>

        <TabsContent value="correlation" className="mt-4">
          <CorrelationMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}
