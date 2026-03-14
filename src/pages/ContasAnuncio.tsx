import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCards } from '@/components/ad-accounts/StatsCards';
import { AdAccountFilters } from '@/components/ad-accounts/AdAccountFilters';
import { AdAccountsTable } from '@/components/ad-accounts/AdAccountsTable';
import { AdAccountDialog } from '@/components/ad-accounts/AdAccountDialog';
import { UploadLoteDialog } from '@/components/ad-accounts/UploadLoteDialog';
import { BulkEditBar } from '@/components/shared/BulkEditBar';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useAdAccounts, useDeleteAdAccount, useBulkUpdateAdAccounts } from '@/hooks/useAdAccounts';
import { mockManagers, mockSuppliers, mockNiches } from '@/data/mock-ad-accounts';
import type { AdAccount, AdAccountFilters as FiltersType, AdAccountPagination } from '@/types/ad-account';
import { toast } from '@/hooks/use-toast';
import type { BulkFieldConfig } from '@/components/shared/BulkEditBar';

const ACCOUNT_STATUS_OPTIONS = [
  { value: 'WARMING', label: 'Aquecendo' },
  { value: 'ACTIVE', label: 'Ativa' },
  { value: 'ADVERTISING', label: 'Anunciando' },
  { value: 'DISABLED', label: 'Desabilitada' },
  { value: 'ROLLBACK', label: 'Rollback' },
];

const USAGE_STATUS_OPTIONS = [
  { value: 'IN_USE', label: 'Em Uso' },
  { value: 'STANDBY', label: 'Standby' },
  { value: 'RETIRED', label: 'Aposentada' },
];

export default function ContasAnuncio() {
  const [filters, setFilters] = useState<FiltersType>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<AdAccountPagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdAccount | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdAccount | null>(null);

  const deleteAccount = useDeleteAdAccount();
  const bulkUpdate = useBulkUpdateAdAccounts();

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

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
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

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

  const handleBulkApply = async (values: Record<string, string>) => {
    const data: Record<string, string> = {};
    if (values.accountStatus) data.accountStatus = values.accountStatus;
    if (values.usageStatus) data.usageStatus = values.usageStatus;
    if (values.managerId) {
      data.managerId = values.managerId;
      data.managerName = mockManagers.find(m => m.id === values.managerId)?.name || '';
    }
    if (values.supplierId) {
      data.supplierId = values.supplierId;
      data.supplierName = mockSuppliers.find(s => s.id === values.supplierId)?.name || '';
    }
    if (values.niche) data.niche = values.niche;

    await bulkUpdate.mutateAsync({ ids: [...selectedIds], data: data as any });
    toast({ title: `${selectedIds.size} contas atualizadas` });
    setSelectedIds(new Set());
  };

  const bulkFields: BulkFieldConfig[] = [
    { key: 'accountStatus', label: 'Status Conta', options: ACCOUNT_STATUS_OPTIONS },
    { key: 'usageStatus', label: 'Status Uso', options: USAGE_STATUS_OPTIONS },
    { key: 'managerId', label: 'Gestor', options: mockManagers.map(m => ({ value: m.id, label: m.name })) },
    { key: 'supplierId', label: 'Fornecedor', options: mockSuppliers.map(s => ({ value: s.id, label: s.name })) },
    { key: 'niche', label: 'Nicho', options: mockNiches.map(n => ({ value: n, label: n })) },
  ];

  return (
    <div className="space-y-6 pb-20">
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

      <StatsCards filters={filters} onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))} />

      <AdAccountFilters
        filters={filters} searchValue={searchValue} onSearchChange={setSearchValue}
        onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))} onClear={() => { setFilters({}); setSearchValue(''); }}
      />

      {!isLoading && data && (
        <AdAccountsTable
          data={sorted} total={data.total} totalPages={data.totalPages}
          pagination={pagination} onPaginationChange={p => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={a => { setEditingAccount(a); setDialogOpen(true); }}
          onDelete={a => setDeleteTarget(a)}
          onViewConnections={a => { setConnectionsName(a.name); setConnectionsOpen(true); }}
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

      <AdAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editingAccount} />
      <UploadLoteDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog
        open={!!deleteTarget} title="Excluir conta"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
