import { useMemo, useState } from 'react';
import { useIncidents } from '@/hooks/useDiagnostics';
import { ASSET_TYPE_LABELS, RESTRICTION_TYPE_LABELS } from '@/types/diagnostic';
import type { RestrictionType } from '@/types/diagnostic';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

export function CorrelationMatrix() {
  const { data: incidents } = useIncidents({});
  const [selectedCell, setSelectedCell] = useState<{ a: string; b: string } | null>(null);

  const { assets, matrix, maxVal } = useMemo(() => {
    if (!incidents?.length) return { assets: [], matrix: {} as Record<string, Record<string, string[]>>, maxVal: 0 };

    // Group incidents by their linked elements to find correlations
    const assetIncidents: Record<string, Set<string>> = {};
    incidents.forEach(inc => {
      const key = `${inc.assetType}:${inc.assetId}`;
      if (!assetIncidents[key]) assetIncidents[key] = new Set();
      assetIncidents[key].add(inc.id);
      inc.linkedElements.forEach(el => {
        if (!assetIncidents[el]) assetIncidents[el] = new Set();
        assetIncidents[el].add(inc.id);
      });
    });

    const assetKeys = Object.keys(assetIncidents).filter(k => assetIncidents[k].size > 0);
    const matrix: Record<string, Record<string, string[]>> = {};
    let maxVal = 0;

    assetKeys.forEach(a => {
      matrix[a] = {};
      assetKeys.forEach(b => {
        if (a === b) { matrix[a][b] = []; return; }
        const shared = [...assetIncidents[a]].filter(id => assetIncidents[b].has(id));
        matrix[a][b] = shared;
        if (shared.length > maxVal) maxVal = shared.length;
      });
    });

    const assets = assetKeys.map(k => {
      const inc = incidents.find(i => `${i.assetType}:${i.assetId}` === k);
      return { key: k, name: inc?.assetName || k, type: inc?.assetType };
    });

    // Deduplicate by key (some keys are just IDs from linkedElements)
    const seen = new Set<string>();
    const unique = assets.filter(a => { if (seen.has(a.key)) return false; seen.add(a.key); return true; });

    return { assets: unique, matrix, maxVal };
  }, [incidents]);

  const cellIncidents = useMemo(() => {
    if (!selectedCell || !incidents) return [];
    const ids = matrix[selectedCell.a]?.[selectedCell.b] || [];
    return incidents.filter(i => ids.includes(i.id));
  }, [selectedCell, matrix, incidents]);

  if (assets.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado de correlação disponível.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Matriz mostrando a quantidade de incidentes compartilhados entre ativos. Clique em uma célula para ver os detalhes.
      </p>

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-foreground font-medium sticky left-0 bg-background z-10" />
              {assets.map(a => (
                <th key={a.key} className="p-2 text-left text-muted-foreground font-medium max-w-[100px] truncate" title={a.name}>
                  {a.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map(row => (
              <tr key={row.key}>
                <td className="p-2 font-medium text-foreground max-w-[120px] truncate sticky left-0 bg-background z-10" title={row.name}>
                  {row.name}
                </td>
                {assets.map(col => {
                  const count = (matrix[row.key]?.[col.key] || []).length;
                  const intensity = maxVal > 0 ? count / maxVal : 0;
                  const isself = row.key === col.key;
                  return (
                    <td
                      key={col.key}
                      className={`p-2 text-center border border-border min-w-[60px] ${isself ? 'bg-surface-2' : 'cursor-pointer hover:ring-1 hover:ring-ring'}`}
                      style={!isself && count > 0 ? { backgroundColor: `hsl(0 72% 51% / ${intensity * 0.5 + 0.1})` } : undefined}
                      onClick={() => !isself && count > 0 && setSelectedCell({ a: row.key, b: col.key })}
                    >
                      {isself ? '—' : count || ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedCell} onOpenChange={v => { if (!v) setSelectedCell(null); }}>
        <DialogContent className="max-w-lg max-h-[60vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incidentes em Comum</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {cellIncidents.map(inc => (
              <div key={inc.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{inc.assetName}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(inc.date), 'dd/MM/yyyy')}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {RESTRICTION_TYPE_LABELS[inc.restrictionType as RestrictionType]}
                </Badge>
                {inc.suspectedCause && <p className="text-xs text-muted-foreground mt-1">{inc.suspectedCause}</p>}
              </div>
            ))}
            {cellIncidents.length === 0 && <p className="text-sm text-muted-foreground">Nenhum incidente encontrado.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
