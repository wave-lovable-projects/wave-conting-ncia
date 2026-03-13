import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCards } from '@/components/ad-accounts/StatsCards';
import { AdAccountFilters } from '@/components/ad-accounts/AdAccountFilters';
import { AdAccountsTable } from '@/components/ad-accounts/AdAccountsTable';
import { AdAccountDialog } from '@/components/ad-accounts/AdAccountDialog';
import { BulkEditDialog } from '@/components/ad-accounts/BulkEditDialog';
import { UploadLoteDialog } from '@/components/ad-accounts/UploadLoteDialog';
import { BulkActionsBar } from '@/components/shared/BulkActionsBar';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useAdAccounts, useDeleteAdAccount } from '@/hooks/useAdAccounts';
import type { AdAccount, AdAccountFilters as FiltersType, AdAccountPagination } from '@/types/ad-account';
import { toast } from '@/hooks/use-toast';

export default function ContasAnuncio() {
  const [filters, setFilters] = useState<FiltersType>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<AdAccountPagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdAccount | null>(null);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdAccount | null>(null);

  const deleteAccount = useDeleteAdAccount();

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  // Reset page on filter change
  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [filters]);

  const { data, isLoading } = useAdAccounts(filters, pagination);

  const sorted = useMemo(() => {
    if (!data?.items || !sortField) return data?.items || [];
    return [...data.items].sort((a, b) => {
      const aVal = (a as any)[sortField] || '';
      const bVal = (b as any)[sortField] || '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data?.items, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleFilterChange = (partial: Partial<FiltersType>) => setFilters(f => ({ ...f, ...partial }));

  const handleClearFilters = () => { setFilters({}); setSearchValue(''); };

  const handleEdit = (account: AdAccount) => { setEditingAccount(account); setDialogOpen(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteAccount.mutateAsync(deleteTarget.id);
    toast({ title: 'Conta excluída' });
    setDeleteTarget(null);
    setSelectedIds(prev => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteAccount.mutateAsync(id);
    }
    toast({ title: `${selectedIds.size} contas excluídas` });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas de Anúncio"
        description="Gerencie todas as contas de anúncio do sistema"
        actions={
          <>
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" /> Importar CSV
            </Button>
            <Button onClick={() => { setEditingAccount(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Nova Conta
            </Button>
          </>
        }
      />

      <StatsCards filters={filters} onFilterChange={handleFilterChange} />

      <AdAccountFilters
        filters={filters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {selectedIds.size > 0 && (
        <BulkActionsBar
          count={selectedIds.size}
          onBulkEdit={() => setBulkEditOpen(true)}
          onBulkDelete={handleBulkDelete}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

      {!isLoading && data && (
        <AdAccountsTable
          data={sorted}
          total={data.total}
          totalPages={data.totalPages}
          pagination={pagination}
          onPaginationChange={(p) => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={(a) => setDeleteTarget(a)}
          onViewConnections={(a) => { setConnectionsName(a.name); setConnectionsOpen(true); }}
        />
      )}

      <AdAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editingAccount} />
      <BulkEditDialog open={bulkEditOpen} onOpenChange={setBulkEditOpen} selectedIds={[...selectedIds]} onDone={() => setSelectedIds(new Set())} />
      <UploadLoteDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir conta"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
