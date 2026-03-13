import { useState } from 'react';
import { useIncidents, useCreateIncident } from '@/hooks/useDiagnostics';
import type { IncidentFilters, RestrictionType, AssetType } from '@/types/diagnostic';
import { ASSET_TYPE_LABELS, RESTRICTION_TYPE_LABELS } from '@/types/diagnostic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Monitor, Briefcase, UserCircle, FileText, Radio } from 'lucide-react';
import { format } from 'date-fns';
import { AddIncidentDialog } from './AddIncidentDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComp } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const ASSET_ICONS: Record<AssetType, typeof Monitor> = {
  AD_ACCOUNT: Monitor,
  BUSINESS_MANAGER: Briefcase,
  PROFILE: UserCircle,
  PAGE: FileText,
  PIXEL: Radio,
};

const RESTRICTION_COLORS: Record<RestrictionType, string> = {
  CONTA_DESATIVADA: 'bg-destructive/15 text-destructive border-destructive/30',
  BM_BLOQUEADA: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  PERFIL_DESATIVADO: 'bg-warning/15 text-warning border-warning/30',
  RESTRICAO_ANUNCIO: 'bg-caution/15 text-caution border-caution/30',
  AVISO: 'bg-info/15 text-info border-info/30',
  OUTRO: 'bg-muted text-muted-foreground border-border',
};

export function IncidentTimeline() {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const effectiveFilters: IncidentFilters = {
    ...filters,
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
  };

  const { data: incidents } = useIncidents(effectiveFilters);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filters.assetType || 'ALL'} onValueChange={v => setFilters(f => ({ ...f, assetType: v === 'ALL' ? undefined : v }))}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Tipo de ativo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipos</SelectItem>
            {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.restrictionType || 'ALL'} onValueChange={v => setFilters(f => ({ ...f, restrictionType: v === 'ALL' ? undefined : v }))}>
          <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="Tipo de restrição" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as restrições</SelectItem>
            {Object.entries(RESTRICTION_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn('gap-1', !startDate && 'text-muted-foreground')}>
              <Calendar className="h-3.5 w-3.5" />
              {startDate ? format(startDate, 'dd/MM/yyyy') : 'Data início'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComp mode="single" selected={startDate} onSelect={setStartDate} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn('gap-1', !endDate && 'text-muted-foreground')}>
              <Calendar className="h-3.5 w-3.5" />
              {endDate ? format(endDate, 'dd/MM/yyyy') : 'Data fim'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComp mode="single" selected={endDate} onSelect={setEndDate} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        <div className="ml-auto">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Registrar Incidente
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {(incidents || []).map(inc => {
            const Icon = ASSET_ICONS[inc.assetType];
            return (
              <div key={inc.id} className="relative pl-10">
                <div className="absolute left-2.5 top-3 h-3 w-3 rounded-full bg-surface-3 border-2 border-border" />
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{inc.assetName}</span>
                      <Badge variant="outline" className="text-[10px]">{ASSET_TYPE_LABELS[inc.assetType]}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(inc.date), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={cn('text-xs', RESTRICTION_COLORS[inc.restrictionType])}>
                      {RESTRICTION_TYPE_LABELS[inc.restrictionType]}
                    </Badge>
                  </div>
                  {inc.facebookReason && (
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">Facebook:</span> {inc.facebookReason}
                    </p>
                  )}
                  {inc.suspectedCause && (
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">Causa suspeita:</span> {inc.suspectedCause}
                    </p>
                  )}
                  {inc.notes && <p className="text-xs text-muted-foreground italic">{inc.notes}</p>}
                  <p className="text-[10px] text-muted-foreground mt-2">Registrado por {inc.createdByName}</p>
                </div>
              </div>
            );
          })}
          {(incidents || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum incidente encontrado.</p>
          )}
        </div>
      </div>

      <AddIncidentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
