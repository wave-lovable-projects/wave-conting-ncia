import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/PageHeader';
import { SupplierCard } from '@/components/suppliers/SupplierCard';
import { SupplierDialog } from '@/components/suppliers/SupplierDialog';
import { SupplierGridFilters } from '@/components/suppliers/SupplierGridFilters';
import { SupplierCharts } from '@/components/suppliers/SupplierCharts';
import { ComplaintCard } from '@/components/suppliers/ComplaintCard';
import { ComplaintFiltersBar } from '@/components/suppliers/ComplaintFilters';
import { ComplaintDialog } from '@/components/suppliers/ComplaintDialog';
import { ComplaintDetailSheet } from '@/components/suppliers/ComplaintDetailSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useSuppliers, useDeleteSupplier, useComplaints } from '@/hooks/useSuppliers';
import { toast } from '@/hooks/use-toast';
import type { Supplier, SupplierFilters, ComplaintFilters as CFilters } from '@/types/supplier';
import { Package } from 'lucide-react';

export default function Fornecedores() {
  const [supplierFilters, setSupplierFilters] = useState<SupplierFilters>({});
  const [complaintFilters, setComplaintFilters] = useState<CFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const { data: suppliers, isLoading } = useSuppliers(supplierFilters);
  const { data: complaints } = useComplaints(complaintFilters);
  const deleteMutation = useDeleteSupplier();

  const handleEdit = (s: Supplier) => { setEditingSupplier(s); setDialogOpen(true); };
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    toast({ title: 'Fornecedor excluído' });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Fornecedores" />

      <Tabs defaultValue="suppliers">
        <TabsList>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="complaints">Reclamações</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4 mt-4">
          <SupplierGridFilters
            filters={supplierFilters}
            onFilterChange={(f) => setSupplierFilters((prev) => ({ ...prev, ...f }))}
            onAdd={() => { setEditingSupplier(null); setDialogOpen(true); }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers?.map((s) => (
              <SupplierCard key={s.id} supplier={s} onEdit={handleEdit} onDelete={setDeleteId} />
            ))}
          </div>
          {suppliers?.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhum fornecedor encontrado</p>
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          <SupplierCharts />
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4 mt-4">
          <ComplaintFiltersBar
            filters={complaintFilters}
            onFilterChange={(f) => setComplaintFilters((prev) => ({ ...prev, ...f }))}
            onAdd={() => setComplaintDialogOpen(true)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints?.map((c) => (
              <ComplaintCard key={c.id} complaint={c} onClick={() => setSelectedComplaintId(c.id)} />
            ))}
          </div>
          {complaints?.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhuma reclamação encontrada</p>
          )}
        </TabsContent>
      </Tabs>

      <SupplierDialog open={dialogOpen} onOpenChange={setDialogOpen} supplier={editingSupplier} />
      <ComplaintDialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen} />
      <ComplaintDetailSheet complaintId={selectedComplaintId} onClose={() => setSelectedComplaintId(null)} />
      <ConfirmDialog
        open={!!deleteId}
        title="Excluir Fornecedor"
        description="Tem certeza que deseja excluir este fornecedor?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </div>
  );
}
