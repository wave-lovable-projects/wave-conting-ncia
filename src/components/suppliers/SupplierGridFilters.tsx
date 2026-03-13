import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { SupplierFilters } from '@/types/supplier';

interface SupplierGridProps {
  filters: SupplierFilters;
  onFilterChange: (f: Partial<SupplierFilters>) => void;
  onAdd: () => void;
}

export function SupplierGridFilters({ filters, onFilterChange, onAdd }: SupplierGridProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Buscar fornecedor..."
        value={filters.search ?? ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
        className="w-64"
      />
      <Select value={filters.status ?? 'ALL'} onValueChange={(v) => onFilterChange({ status: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ACTIVE">Ativo</SelectItem>
          <SelectItem value="INACTIVE">Inativo</SelectItem>
        </SelectContent>
      </Select>
      <div className="ml-auto">
        <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" /> Novo Fornecedor</Button>
      </div>
    </div>
  );
}
