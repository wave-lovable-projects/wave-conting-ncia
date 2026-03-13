import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { BMStatsCards } from '@/components/business-managers/BMStatsCards';
import { BMFiltersBar } from '@/components/business-managers/BMFilters';
import { BMTable } from '@/components/business-managers/BMTable';
import { BMDialog } from '@/components/business-managers/BMDialog';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useBMs, useDeleteBM } from '@/hooks/useBusinessManagers';
import type { BusinessManager, BMFilters, BMPagination } from '@/types/business-manager';
import { toast } from '@/hooks/use-toast';

export default function BusinessManagers() {
  const [filters, setFilters] = useState<BMFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<BMPagination>({ page: 1, pageSize: 10 });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBM, setEditingBM] = useState<BusinessManager | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessManager | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deleteBM = useDeleteBM();

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

  return (
    <div className="space-y-6">
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
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={bm => { setEditingBM(bm); setDialogOpen(true); }}
          onDelete={bm => setDeleteTarget(bm)}
          onViewConnections={bm => { setConnectionsName(bm.name); setConnectionsOpen(true); }}
        />
      )}
      <BMDialog open={dialogOpen} onOpenChange={setDialogOpen} bm={editingBM} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir BM" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
