import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RequestFiltersBar } from '@/components/requests/RequestFilters';
import { RequestTable } from '@/components/requests/RequestTable';
import { RequestKanbanBoard } from '@/components/requests/RequestKanbanBoard';
import { RequestDialog } from '@/components/requests/RequestDialog';
import { RequestDetailSheet } from '@/components/requests/RequestDetailSheet';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRequests, useUpdateRequestStatus, useRequestTemplates, useDeleteRequestTemplate } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { useRequestPermissions } from '@/hooks/useRequestPermissions';
import { REQUEST_TYPE_LABELS } from '@/types/request';
import type { RequestFilters, Request, RequestStatus, RequestTemplate } from '@/types/request';
import { Plus, List, Columns3, BarChart3, FileText, Briefcase, User, Globe, BarChart2, DollarSign, Trash2, Play, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  PENDENTE: ['APROVADA', 'REJEITADA'],
  APROVADA: ['SOLICITADA_FORNECEDOR', 'REJEITADA', 'CANCELADA'],
  SOLICITADA_FORNECEDOR: ['RECEBIDA', 'CANCELADA'],
  RECEBIDA: ['EM_AQUECIMENTO', 'CANCELADA'],
  EM_AQUECIMENTO: ['PRONTA', 'CANCELADA'],
  PRONTA: ['ENTREGUE', 'CANCELADA'],
  ENTREGUE: [],
  REJEITADA: [],
  CANCELADA: [],
};

const ASSET_TYPE_ICONS: Record<string, typeof Briefcase> = {
  CONTA_ANUNCIO: BarChart2,
  BUSINESS_MANAGER: Briefcase,
  PERFIL: User,
  PAGINA: Globe,
  SALDO: DollarSign,
};

export default function Solicitacoes() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'kanban' | 'templates'>('list');
  const [filters, setFilters] = useState<RequestFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [templateForDialog, setTemplateForDialog] = useState<RequestTemplate | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const { data: allRequests } = useRequests({});
  const { data: filteredRequests } = useRequests(filters);
  const { data: templates } = useRequestTemplates();
  const updateStatus = useUpdateRequestStatus();
  const deleteTemplate = useDeleteRequestTemplate();
  const user = useUIStore((s) => s.user);
  const permissions = useRequestPermissions(user?.role, user?.id);

  const visibleAll = useMemo(() => {
    if (permissions.canViewAllRequests || !user) return allRequests ?? [];
    return (allRequests ?? []).filter((r) => r.requesterId === user.id);
  }, [allRequests, permissions.canViewAllRequests, user]);

  const visibleFiltered = useMemo(() => {
    if (permissions.canViewAllRequests || !user) return filteredRequests ?? [];
    return (filteredRequests ?? []).filter((r) => r.requesterId === user.id);
  }, [filteredRequests, permissions.canViewAllRequests, user]);

  const handleAdvanceStatus = (r: Request) => {
    const nextStatuses = VALID_TRANSITIONS[r.status] ?? [];
    const next = nextStatuses.find((s) => s !== 'REJEITADA' && s !== 'CANCELADA');
    if (!next) return;
    const STATUS_TOAST: Record<string, string> = {
      APROVADA: 'Solicitação aprovada — próximo passo: solicitar ao fornecedor',
      SOLICITADA_FORNECEDOR: 'Pedido enviado ao fornecedor — acompanhe o prazo de entrega',
      RECEBIDA: 'Ativos recebidos — inicie o aquecimento',
      EM_AQUECIMENTO: 'Aquecimento iniciado — monitore o progresso',
      PRONTA: 'Ativos prontos — entregue ao solicitante',
      ENTREGUE: 'Solicitação entregue com sucesso!',
    };

    updateStatus.mutate(
      { id: r.id, status: next, changedBy: user?.name ?? 'Sistema' },
      {
        onSuccess: () => toast.success(STATUS_TOAST[next] ?? 'Status atualizado com sucesso'),
        onError: () => toast.error('Erro ao atualizar status'),
      }
    );
  };

  const handleCancel = (r: Request) => {
    updateStatus.mutate(
      { id: r.id, status: 'CANCELADA', changedBy: user?.name ?? 'Sistema' },
      {
        onSuccess: () => toast.success('Solicitação cancelada — nenhuma ação adicional necessária'),
        onError: () => toast.error('Erro ao cancelar solicitação'),
      }
    );
  };

  const handleUseTemplate = (tpl: RequestTemplate) => {
    setPickerOpen(false);
    setTemplateForDialog(tpl);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setTemplateForDialog(null);
  };

  const handleDeleteTemplate = () => {
    if (!deleteTemplateId) return;
    deleteTemplate.mutate(deleteTemplateId, {
      onSuccess: () => toast.success('Template excluído'),
      onError: () => toast.error('Erro ao excluir template'),
    });
    setDeleteTemplateId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={permissions.pageTitle}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="rounded-none gap-1.5"
              >
                <List className="h-4 w-4" /> Lista
              </Button>
              <Button
                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('kanban')}
                className="rounded-none gap-1.5"
              >
                <Columns3 className="h-4 w-4" /> Kanban
              </Button>
              <Button
                variant={view === 'templates' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('templates')}
                className="rounded-none gap-1.5"
              >
                <FileText className="h-4 w-4" /> Templates
              </Button>
            </div>
            {/* Split button: Nova Solicitação + Usar Template */}
            <div className="flex items-center">
              <Button
                onClick={() => { setTemplateForDialog(null); setDialogOpen(true); }}
                className="gap-2 rounded-r-none"
              >
                <Plus className="h-4 w-4" /> Nova Solicitação
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPickerOpen(true)} className="gap-2">
                    <FileText className="h-4 w-4" /> Usar Template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        }
      />

      {view === 'templates' ? (
        <TemplatesGrid
          templates={templates ?? []}
          onUse={handleUseTemplate}
          onDelete={(id) => setDeleteTemplateId(id)}
        />
      ) : (
        <>
          <RequestFiltersBar filters={filters} onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))} />
          {view === 'list' ? (
            <RequestTable
              requests={visibleFiltered}
              onView={(r) => setSelectedRequestId(r.id)}
              onAdvanceStatus={permissions.canChangeStatus ? handleAdvanceStatus : undefined}
              onCancel={handleCancel}
              hideSupplierColumn={!permissions.canViewSupplierInfo}
              hideAdvanceAction={!permissions.canChangeStatus}
              permissions={permissions}
            />
          ) : (
            <RequestKanbanBoard
              requests={visibleFiltered}
              onCardClick={(r) => setSelectedRequestId(r.id)}
              permissions={permissions}
            />
          )}
        </>
      )}

      {/* Template Picker Dialog */}
      <TemplatePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        templates={templates ?? []}
        onSelect={handleUseTemplate}
      />

      <RequestDialog open={dialogOpen} onOpenChange={handleDialogClose} initialTemplate={templateForDialog} />
      <RequestDetailSheet requestId={selectedRequestId} onClose={() => setSelectedRequestId(null)} />

      <ConfirmDialog
        open={!!deleteTemplateId}
        title="Excluir Template"
        description="Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteTemplate}
        onCancel={() => setDeleteTemplateId(null)}
        variant="danger"
      />
    </div>
  );
}

// --- Template Picker Dialog ---

function TemplatePickerDialog({ open, onOpenChange, templates, onSelect }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  templates: RequestTemplate[];
  onSelect: (t: RequestTemplate) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Template</DialogTitle>
        </DialogHeader>
        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhum template disponível.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {templates.map((tpl) => {
              const Icon = ASSET_TYPE_ICONS[tpl.assetType] ?? FileText;
              return (
                <Card
                  key={tpl.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => onSelect(tpl)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">{tpl.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{REQUEST_TYPE_LABELS[tpl.assetType]}</span>
                      <span>·</span>
                      <span>Qtd: {tpl.quantity}</span>
                    </div>
                    <PriorityBadge priority={tpl.priority} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Templates Grid View ---

function TemplatesGrid({ templates, onUse, onDelete }: {
  templates: RequestTemplate[];
  onUse: (t: RequestTemplate) => void;
  onDelete: (id: string) => void;
}) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhum template salvo ainda.</p>
        <p className="text-xs text-muted-foreground mt-1">Crie uma solicitação e marque "Salvar como template".</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((tpl) => {
        const Icon = ASSET_TYPE_ICONS[tpl.assetType] ?? FileText;
        const specEntries = Object.entries(tpl.specifications).slice(0, 3);
        return (
          <Card key={tpl.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <h3 className="text-sm font-semibold truncate">{tpl.name}</h3>
                </div>
                <PriorityBadge priority={tpl.priority} />
              </div>

              {tpl.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{REQUEST_TYPE_LABELS[tpl.assetType]}</span>
                <span>·</span>
                <span>Qtd: {tpl.quantity}</span>
              </div>

              {specEntries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {specEntries.map(([k, v]) => (
                    <span key={k} className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="default" className="flex-1 gap-1.5" onClick={() => onUse(tpl)}>
                  <Play className="h-3.5 w-3.5" /> Usar
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(tpl.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground">por {tpl.createdByName}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
