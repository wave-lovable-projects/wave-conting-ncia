import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { BMStatsCards } from '@/components/business-managers/BMStatsCards';
import { BMFiltersBar } from '@/components/business-managers/BMFilters';
import { BMTable } from '@/components/business-managers/BMTable';
import { BMDialog } from '@/components/business-managers/BMDialog';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { BulkEditBar } from '@/components/shared/BulkEditBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useBMs, useDeleteBM, useBulkUpdateBMs } from '@/hooks/useBusinessManagers';
import type { BusinessManager, BMFilters, BMPagination } from '@/types/business-manager';
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

export default function BusinessManagers() {
  const [filters, setFilters] = useState<BMFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<BMPagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBM, setEditingBM] = useState<BusinessManager | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessManager | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deleteBM = useDeleteBM();
  const bulkUpdate = useBulkUpdateBMs();

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [filters]);

  const { data, isLoading } = useBMs(filters, pagination);

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
    await deleteBM.mutateAsync(deleteTarget.id);
    toast({ title: 'BM excluída' });
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteBM.mutateAsync(id);
    }
    toast({ title: `${selectedIds.size} BMs excluídas` });
    setSelectedIds(new Set());
  };

  const handleBulkApply = async (values: Record<string, string>) => {
    const data: Record<string, string> = {};
    if (values.status) data.status = values.status;
    if (values.supplierId) {
      data.supplierId = values.supplierId;
      data.supplierName = SUPPLIER_OPTIONS.find(s => s.value === values.supplierId)?.label || '';
    }
    await bulkUpdate.mutateAsync({ ids: [...selectedIds], data: data as any });
    toast({ title: `${selectedIds.size} BMs atualizadas` });
    setSelectedIds(new Set());
  };

  const bulkFields: BulkFieldConfig[] = [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS },
    { key: 'supplierId', label: 'Fornecedor', options: SUPPLIER_OPTIONS },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Business Managers"
        description="Gerencie todas as Business Managers do sistema"
        actions={<Button onClick={() => { setEditingBM(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Nova BM</Button>}
      />
      <BMStatsCards filters={filters} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} />
      <BMFiltersBar filters={filters} searchValue={searchValue} onSearchChange={setSearchValue} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} onClear={() => { setFilters({}); setSearchValue(''); }} />
      {!isLoading && data && (
        <BMTable
          data={sorted} total={data.total} totalPages={data.totalPages}
          pagination={pagination} onPaginationChange={p => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={bm => { setEditingBM(bm); setDialogOpen(true); }}
          onDelete={bm => setDeleteTarget(bm)}
          onViewConnections={bm => { setConnectionsName(bm.name); setConnectionsOpen(true); }}
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

      <BMDialog open={dialogOpen} onOpenChange={setDialogOpen} bm={editingBM} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir BM" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
