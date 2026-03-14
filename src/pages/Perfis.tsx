import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProfileStatsCards } from '@/components/profiles/ProfileStatsCards';
import { ProfileFiltersBar } from '@/components/profiles/ProfileFilters';
import { ProfileTable } from '@/components/profiles/ProfileTable';
import { ProfileDialog } from '@/components/profiles/ProfileDialog';
import { ProfileDetailSheet } from '@/components/profiles/ProfileDetailSheet';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { BulkEditBar } from '@/components/shared/BulkEditBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProfiles, useDeleteProfile, useBulkUpdateProfiles } from '@/hooks/useProfiles';
import type { Profile, ProfileFilters, ProfilePagination } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import type { BulkFieldConfig } from '@/components/shared/BulkEditBar';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'DISABLED', label: 'Desativado' },
  { value: 'BLOCKED', label: 'Bloqueado' },
];

const SUPPLIER_OPTIONS = [
  { value: 's1', label: 'Fornecedor Alpha' },
  { value: 's2', label: 'Fornecedor Beta' },
  { value: 's3', label: 'Fornecedor Gamma' },
];

const MANAGER_OPTIONS = [
  { value: 'u1', label: 'João Silva' },
  { value: 'u2', label: 'Maria Souza' },
  { value: 'u3', label: 'Carlos Lima' },
];

export default function Perfis() {
  const [filters, setFilters] = useState<ProfileFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<ProfilePagination>({ page: 1, pageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deleteProfile = useDeleteProfile();
  const bulkUpdate = useBulkUpdateProfiles();

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchValue || undefined })), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  useEffect(() => { setPagination(p => ({ ...p, page: 1 })); }, [filters]);

  const { data, isLoading } = useProfiles(filters, pagination);

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
    await deleteProfile.mutateAsync(deleteTarget.id);
    toast({ title: 'Perfil excluído' });
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteProfile.mutateAsync(id);
    }
    toast({ title: `${selectedIds.size} perfis excluídos` });
    setSelectedIds(new Set());
  };

  const handleBulkApply = async (values: Record<string, string>) => {
    const data: Record<string, string> = {};
    if (values.status) data.status = values.status;
    if (values.supplierId) {
      data.supplierId = values.supplierId;
      data.supplierName = SUPPLIER_OPTIONS.find(s => s.value === values.supplierId)?.label || '';
    }
    if (values.managerId) {
      data.managerId = values.managerId;
      data.managerName = MANAGER_OPTIONS.find(m => m.value === values.managerId)?.label || '';
    }
    await bulkUpdate.mutateAsync({ ids: [...selectedIds], data: data as any });
    toast({ title: `${selectedIds.size} perfis atualizados` });
    setSelectedIds(new Set());
  };

  const bulkFields: BulkFieldConfig[] = [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS },
    { key: 'supplierId', label: 'Fornecedor', options: SUPPLIER_OPTIONS },
    { key: 'managerId', label: 'Gestor', options: MANAGER_OPTIONS },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Perfis"
        description="Gerencie todos os perfis do sistema"
        actions={<Button onClick={() => { setEditingProfile(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Novo Perfil</Button>}
      />
      <ProfileStatsCards filters={filters} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} />
      <ProfileFiltersBar filters={filters} searchValue={searchValue} onSearchChange={setSearchValue} onFilterChange={f => setFilters(p => ({ ...p, ...f }))} onClear={() => { setFilters({}); setSearchValue(''); }} />
      {!isLoading && data && (
        <ProfileTable
          data={sorted} total={data.total} totalPages={data.totalPages}
          pagination={pagination} onPaginationChange={p => setPagination(prev => ({ ...prev, ...p }))}
          selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={p => { setEditingProfile(p); setDialogOpen(true); }}
          onDelete={p => setDeleteTarget(p)}
          onViewDetails={p => setDetailProfile(p)}
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

      <ProfileDialog open={dialogOpen} onOpenChange={setDialogOpen} profile={editingProfile} />
      <ProfileDetailSheet open={!!detailProfile} onOpenChange={v => { if (!v) setDetailProfile(null); }} profile={detailProfile} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir perfil" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
