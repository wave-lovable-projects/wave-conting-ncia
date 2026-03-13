import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getMockDiagnosticNodes } from '@/data/mock-diagnostics';
import { useIncidents } from '@/hooks/useDiagnostics';
import { ASSET_TYPE_LABELS, RESTRICTION_TYPE_LABELS } from '@/types/diagnostic';
import type { RestrictionType } from '@/types/diagnostic';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useMemo } from 'react';

interface NodeDetailPanelProps {
  nodeId: string;
  onClose: () => void;
}

export function NodeDetailPanel({ nodeId, onClose }: NodeDetailPanelProps) {
  const node = useMemo(() => getMockDiagnosticNodes().find(n => n.id === nodeId), [nodeId]);
  const { data: incidents } = useIncidents({});

  const relatedIncidents = useMemo(() =>
    (incidents || []).filter(i => i.assetId === nodeId || i.linkedElements.includes(nodeId)),
    [incidents, nodeId]
  );

  if (!node) return null;

  return (
    <Sheet open onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent className="w-[400px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">{node.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{ASSET_TYPE_LABELS[node.type]}</Badge>
            <StatusBadge status={node.status} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">ID</p>
            <p className="text-sm text-muted-foreground font-mono">{node.id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Incidentes relacionados ({relatedIncidents.length})
            </p>
            {relatedIncidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum incidente encontrado.</p>
            ) : (
              <div className="space-y-2">
                {relatedIncidents.map(inc => (
                  <div key={inc.id} className="rounded-lg border border-border bg-surface-1 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-[10px]">
                        {RESTRICTION_TYPE_LABELS[inc.restrictionType as RestrictionType] || inc.restrictionType}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(inc.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{inc.assetName}</p>
                    {inc.suspectedCause && (
                      <p className="text-[10px] text-muted-foreground mt-1">Causa: {inc.suspectedCause}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
