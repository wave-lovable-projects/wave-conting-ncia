import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { RequestFilters } from '@/types/request';

interface Props {
  filters: RequestFilters;
  onFilterChange: (f: Partial<RequestFilters>) => void;
}

export function RequestFiltersBar({ filters, onFilterChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Buscar solicitação..."
        value={filters.search ?? ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
        className="w-64"
      />
      <Select value={filters.type ?? 'ALL'} onValueChange={(v) => onFilterChange({ type: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos Tipos</SelectItem>
          <SelectItem value="BM">BM</SelectItem>
          <SelectItem value="ACCOUNT">Conta</SelectItem>
          <SelectItem value="PROFILE">Perfil</SelectItem>
          <SelectItem value="BALANCE">Saldo</SelectItem>
          <SelectItem value="OTHER">Outro</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.status ?? 'ALL'} onValueChange={(v) => onFilterChange({ status: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="PENDING">Pendente</SelectItem>
          <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
          <SelectItem value="DONE">Concluída</SelectItem>
          <SelectItem value="REJECTED">Rejeitada</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.priority ?? 'ALL'} onValueChange={(v) => onFilterChange({ priority: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Prioridade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="LOW">Baixa</SelectItem>
          <SelectItem value="MEDIUM">Média</SelectItem>
          <SelectItem value="HIGH">Alta</SelectItem>
          <SelectItem value="URGENT">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
