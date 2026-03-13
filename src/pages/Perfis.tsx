import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProfileStatsCards } from '@/components/profiles/ProfileStatsCards';
import { ProfileFiltersBar } from '@/components/profiles/ProfileFilters';
import { ProfileTable } from '@/components/profiles/ProfileTable';
import { ProfileDialog } from '@/components/profiles/ProfileDialog';
import { ProfileDetailSheet } from '@/components/profiles/ProfileDetailSheet';
import { AssetConnectionsDialog } from '@/components/shared/AssetConnectionsDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProfiles, useDeleteProfile } from '@/hooks/useProfiles';
import type { Profile, ProfileFilters, ProfilePagination } from '@/types/profile';
import { toast } from '@/hooks/use-toast';

export default function Perfis() {
  const [filters, setFilters] = useState<ProfileFilters>({});
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState<ProfilePagination>({ page: 1, pageSize: 10 });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connectionsName, setConnectionsName] = useState('');

  const deleteProfile = useDeleteProfile();

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

  return (
    <div className="space-y-6">
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
          sortField={sortField} sortDir={sortDir} onSort={handleSort}
          onEdit={p => { setEditingProfile(p); setDialogOpen(true); }}
          onDelete={p => setDeleteTarget(p)}
          onViewDetails={p => setDetailProfile(p)}
          onViewConnections={p => { setConnectionsName(p.name); setConnectionsOpen(true); }}
        />
      )}
      <ProfileDialog open={dialogOpen} onOpenChange={setDialogOpen} profile={editingProfile} />
      <ProfileDetailSheet open={!!detailProfile} onOpenChange={v => { if (!v) setDetailProfile(null); }} profile={detailProfile} />
      <AssetConnectionsDialog open={connectionsOpen} onOpenChange={setConnectionsOpen} assetName={connectionsName} />
      <ConfirmDialog open={!!deleteTarget} title="Excluir perfil" description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
