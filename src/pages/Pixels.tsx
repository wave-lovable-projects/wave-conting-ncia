import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PixelStatsCards } from '@/components/pixels/PixelStatsCards';
import { PixelFiltersBar } from '@/components/pixels/PixelFilters';
import { PixelTable } from '@/components/pixels/PixelTable';
import { PixelDialog } from '@/components/pixels/PixelDialog';
import { BulkActionsBar } from '@/components/shared/BulkActionsBar';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePixels, useDeletePixel, useBulkDeletePixels } from '@/hooks/usePixels';
import type { Pixel, PixelFilters, PixelPagination } from '@/types/pixel';
import { toast } from '@/hooks/use-toast';

export default function Pixels() {
  const [filters, setFilters] = useState<PixelFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<PixelPagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPixel, setEditingPixel] = useState<Pixel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pixel | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deletePixel = useDeletePixel();
  const bulkDelete = useBulkDeletePixels();

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [filters]);

  const { data, isLoading } = usePixels(filters, pagination);

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
    await deletePixel.mutateAsync(deleteTarget.id);
    toast({ title: 'Pixel excluído' });
    setDeleteTarget(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
  };

  const handleBulkDelete = async () => {
    await bulkDelete.mutateAsync([...selectedIds]);
    toast({ title: `${selectedIds.size} pixels excluídos` });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pixels"
        description="Gerencie todos os pixels do sistema"
        actions={<Button onClick={() => { setEditingPixel(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Novo Pixel</Button>}
      />
      <PixelStatsCards filters={filters} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} />
      <PixelFiltersBar filters={filters} searchValue={searchValue} onSearchChange={setSearchValue} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} onClear={() => { setFilters({}); setSearchValue(''); }} />
      {selectedIds.size > 0 && (
        <BulkActionsBar count={selectedIds.size} onBulkDelete={handleBulkDelete} onClear={() => setSelectedIds(new Set())} />
      )}
      {!isLoading && data && (
        <PixelTable
          data={sorted} total={data.total} totalPages={data.totalPages}
          pagination={pagination} onPaginationChange={p => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={p => { setEditingPixel(p); setDialogOpen(true); }}
          onDelete={p => setDeleteTarget(p)}
          onViewConnections={p => { setConnectionsName(p.name); setConnectionsOpen(true); }}
        />
      )}
      <PixelDialog open={dialogOpen} onOpenChange={setDialogOpen} pixel={editingPixel} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir pixel" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
