import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageStatsCards } from '@/components/pages/PageStatsCards';
import { PageFiltersBar } from '@/components/pages/PageFilters';
import { PageTable } from '@/components/pages/PageTable';
import { PageDialog } from '@/components/pages/PageDialog';
import { UploadPaginasDialog } from '@/components/pages/UploadPaginasDialog';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { BulkEditBar } from '@/components/shared/BulkEditBar';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { usePages, useDeletePage, useBulkUpdatePages } from '@/hooks/usePages';
import type { FacebookPage, PageFilters, PagePagination } from '@/types/page';
import { toast } from '@/hooks/use-toast';
import type { BulkFieldConfig } from '@/components/shared/BulkEditBar';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Ativa' },
  { value: 'DISABLED', label: 'Desativada' },
  { value: 'BLOCKED', label: 'Bloqueada' },
];

const SUPPLIER_OPTIONS = [
  { value: 's1', label: 'Fornecedor Alpha' },
  { value: 's2', label: 'Fornecedor Beta' },
  { value: 's3', label: 'Fornecedor Gamma' },
];

const BM_OPTIONS = [
  { value: 'bm-1', label: 'BM Principal Ads' },
  { value: 'bm-3', label: 'BM Pixels Central' },
  { value: 'bm-5', label: 'BM Misto Geral' },
  { value: 'bm-6', label: 'BM Ads Escala' },
  { value: 'bm-10', label: 'BM Páginas Social' },
  { value: 'bm-11', label: 'BM Misto Backup' },
];

const MANAGER_OPTIONS = [
  { value: 'u1', label: 'João Silva' },
  { value: 'u2', label: 'Maria Souza' },
  { value: 'u3', label: 'Carlos Lima' },
];

export default function Paginas() {
  const [filters, setFilters] = useState<PageFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<PagePagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<FacebookPage | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FacebookPage | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deletePage = useDeletePage();
  const bulkUpdate = useBulkUpdatePages();

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [filters]);

  const { data, isLoading } = usePages(filters, pagination);

  const sorted = useMemo(() => {
    if (!data?.items || !sortField) return data?.items || [];
    return [...data.items].sort((a, b) => {
      const aVal = (a as any)[sortField] || '';
      const bVal = (b as any)[sortField] || '';
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  }, [data?.items, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePage.mutateAsync(deleteTarget.id);
    toast({ title: 'Página excluída' });
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deletePage.mutateAsync(id);
    }
    toast({ title: `${selectedIds.size} páginas excluídas` });
    setSelectedIds(new Set());
  };

  const handleBulkApply = async (values: Record<string, string>) => {
    const data: Record<string, string> = {};
    if (values.status) data.status = values.status;
    if (values.supplierId) {
      data.supplierId = values.supplierId;
      data.supplierName = SUPPLIER_OPTIONS.find(s => s.value === values.supplierId)?.label || '';
    }
    if (values.bmId) {
      data.bmId = values.bmId;
      data.bmName = BM_OPTIONS.find(b => b.value === values.bmId)?.label || '';
    }
    if (values.managerId) {
      data.managerId = values.managerId;
      data.managerName = MANAGER_OPTIONS.find(m => m.value === values.managerId)?.label || '';
    }
    await bulkUpdate.mutateAsync({ ids: [...selectedIds], data: data as any });
    toast({ title: `${selectedIds.size} páginas atualizadas` });
    setSelectedIds(new Set());
  };

  const bulkFields: BulkFieldConfig[] = [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS },
    { key: 'supplierId', label: 'Fornecedor', options: SUPPLIER_OPTIONS },
    { key: 'bmId', label: 'BM', options: BM_OPTIONS },
    { key: 'managerId', label: 'Gestor', options: MANAGER_OPTIONS },
  ];

  const handleExport = () => {
    const items = data?.items || [];
    const csv = ['name,pageId,bmName,supplierName,status,receivedAt,managerName,notes', ...items.map(p => `${p.name},${p.pageId},${p.bmName || ''},${p.supplierName || ''},${p.status},${p.receivedAt || ''},${p.managerName || ''},${p.notes || ''}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'paginas.csv'; a.click();
    toast({ title: 'CSV exportado' });
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Páginas"
        description="Gerencie todas as páginas do sistema"
        actions={
          <>
            <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Exportar CSV</Button>
            <Button variant="outline" onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4 mr-2" /> Importar CSV</Button>
            <Button onClick={() => { setEditingPage(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Nova Página</Button>
          </>
        }
      />
      <PageStatsCards filters={filters} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} />
      <PageFiltersBar filters={filters} searchValue={searchValue} onSearchChange={setSearchValue} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} onClear={() => { setFilters({}); setSearchValue(''); }} />
      {!isLoading && data && (
        <PageTable
          data={sorted} total={data.total} totalPages={data.totalPages}
          pagination={pagination} onPaginationChange={p => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={p => { setEditingPage(p); setDialogOpen(true); }}
          onDelete={p => setDeleteTarget(p)}
          onViewConnections={p => { setConnectionsName(p.name); setConnectionsOpen(true); }}
        />
      )}

      {selectedIds.size > 0 && (
        <BulkEditBar
          count={selectedIds.size}
          fields={bulkFields}
          onApply={handleBulkApply}
          onBulkDelete={handleBulkDelete}
          onClear={() => setSelectedIds(new Set())}
          isApplying={bulkUpdate.isPending}
        />
      )}

      <PageDialog open={dialogOpen} onOpenChange={setDialogOpen} page={editingPage} />
      <UploadPaginasDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir página" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
