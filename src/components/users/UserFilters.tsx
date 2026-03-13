import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserFilters } from '@/types/user';
import { mockSquads } from '@/data/mock-users';

interface Props {
  filters: UserFilters;
  onFilterChange: (f: Partial<UserFilters>) => void;
}

export function UserFiltersBar({ filters, onFilterChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Buscar por nome ou email..."
        value={filters.search ?? ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
        className="w-64"
      />
      <Select value={filters.role ?? 'ALL'} onValueChange={(v) => onFilterChange({ role: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="GESTOR">Gestor</SelectItem>
          <SelectItem value="AUXILIAR">Auxiliar</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.squadId ?? 'ALL'} onValueChange={(v) => onFilterChange({ squadId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Squad" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas Squads</SelectItem>
          {mockSquads.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.isActive ?? 'ALL'} onValueChange={(v) => onFilterChange({ isActive: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
