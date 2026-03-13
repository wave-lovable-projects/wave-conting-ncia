import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ActivityFiltersBar } from '@/components/activities/ActivityFilters';
import { useActivityLogs, useActivitySummary } from '@/hooks/useActivities';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Users, Layers } from 'lucide-react';
import { ACTION_LABELS, ENTITY_TYPE_LABELS } from '@/types/activity';
import type { ActivityAction, ActivityFilters } from '@/types/activity';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ACTION_COLORS: Record<ActivityAction, string> = {
  created: 'bg-success/15 text-success border-success/30',
  updated: 'bg-info/15 text-info border-info/30',
  deleted: 'bg-destructive/15 text-destructive border-destructive/30',
  imported: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
};

export default function Atividades() {
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: logsData } = useActivityLogs(filters, pagination);
  const { data: summary } = useActivitySummary(filters);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRows(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Log de Atividades" subtitle="Histórico de todas as ações realizadas no sistema" />

      {/* Summary Panel */}
      <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground mb-2">
            {summaryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Resumo
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" /> Ações por Usuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(summary?.topUsers || []).map(u => (
                    <button
                      key={u.id}
                      className="flex items-center justify-between w-full text-left hover:bg-surface-2 rounded-md px-2 py-1 transition-colors"
                      onClick={() => setFilters(f => ({ ...f, userId: u.id }))}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[9px] bg-surface-3">
                            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground">{u.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{u.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" /> Ações por Tipo de Entidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(summary?.topEntities || []).map(e => (
                    <button
                      key={e.type}
                      className="flex items-center justify-between w-full text-left hover:bg-surface-2 rounded-md px-2 py-1 transition-colors"
                      onClick={() => setFilters(f => ({ ...f, entityTypes: [e.type] }))}
                    >
                      <span className="text-xs text-foreground">{ENTITY_TYPE_LABELS[e.type] || e.type}</span>
                      <Badge variant="outline" className="text-[10px]">{e.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Filters */}
      <ActivityFiltersBar filters={filters} onChange={f => { setFilters(f); setPagination(p => ({ ...p, page: 1 })); }} />

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1">
              <TableHead className="w-[160px]">Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logsData?.items || []).map(log => (
              <TableRow key={log.id} className="hover:bg-surface-1">
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[9px] bg-surface-3">
                        {log.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-foreground">{log.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-[10px]', ACTION_COLORS[log.action])}>
                    {ACTION_LABELS[log.action]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {ENTITY_TYPE_LABELS[log.entityType] || log.entityType}
                </TableCell>
                <TableCell className="text-xs text-foreground">{log.entityName || '—'}</TableCell>
                <TableCell>
                  {log.details ? (
                    <div>
                      <button
                        className="text-xs text-info hover:underline"
                        onClick={() => toggleRow(log.id)}
                      >
                        {expandedRows.has(log.id) ? 'Ocultar' : 'Ver detalhes'}
                      </button>
                      {expandedRows.has(log.id) && (
                        <div className="mt-1 text-[11px] text-muted-foreground bg-surface-1 rounded p-2">
                          {log.details.field && (
                            <p>
                              Campo <span className="font-medium text-foreground">{log.details.field}</span>:{' '}
                              <span className="text-destructive">{log.details.oldValue}</span> →{' '}
                              <span className="text-success">{log.details.newValue}</span>
                            </p>
                          )}
                          {log.details.count && <p>Quantidade: {log.details.count}</p>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={pagination.page}
        totalPages={logsData?.totalPages || 1}
        totalItems={logsData?.total || 0}
        pageSize={pagination.pageSize}
        onPageChange={p => setPagination(prev => ({ ...prev, page: p }))}
        onPageSizeChange={s => setPagination({ page: 1, pageSize: s })}
      />
    </div>
  );
}
