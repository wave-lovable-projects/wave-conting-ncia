import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoreHorizontal, Copy, Pencil, Link2, Trash2, ArrowUpDown, Crosshair } from 'lucide-react';
import type { Pixel, PixelPagination } from '@/types/pixel';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PixelTableProps {
  data: Pixel[];
  total: number;
  totalPages: number;
  pagination: PixelPagination;
  onPaginationChange: (p: Partial<PixelPagination>) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (p: Pixel) => void;
  onDelete: (p: Pixel) => void;
  onViewConnections: (p: Pixel) => void;
}

function SortHeader({ field, label, sortField, onSort }: { field: string; label: string; sortField: string | null; onSort: (f: string) => void }) {
  return (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(field)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );
}

export function PixelTable({ data, total, totalPages, pagination, onPaginationChange, selectedIds, onSelectionChange, sortField, sortDir, onSort, onEdit, onDelete, onViewConnections }: PixelTableProps) {
  if (data.length === 0) return <EmptyState title="Nenhum pixel encontrado" description="Ajuste os filtros ou crie um novo pixel." icon={Crosshair} />;

  const copyId = (id: string) => { navigator.clipboard.writeText(id); toast({ title: 'Pixel ID copiado!' }); };
  const allSelected = data.length > 0 && data.every(p => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) onSelectionChange(new Set());
    else onSelectionChange(new Set(data.map(p => p.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectionChange(next);
  };

  return (
    <div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1 hover:bg-surface-1">
              <TableHead className="w-[40px]"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
              <TableHead><SortHeader field="name" label="Nome" sortField={sortField} onSort={onSort} /></TableHead>
              <TableHead>Pixel ID</TableHead>
              <TableHead>BM Vinculada</TableHead>
              <TableHead><SortHeader field="supplierName" label="Fornecedor" sortField={sortField} onSort={onSort} /></TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Domínio</TableHead>
              <TableHead>Dt. Recebimento</TableHead>
              <TableHead>Dt. Block</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="w-[60px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(p => (
              <TableRow key={p.id} data-state={selectedIds.has(p.id) ? 'selected' : undefined}>
                <TableCell><Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleOne(p.id)} /></TableCell>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono text-muted-foreground">{p.pixelId}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyId(p.pixelId)}><Copy className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.bmName || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.supplierName || '—'}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.domain || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.receivedAt ? format(new Date(p.receivedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.blockedAt ? format(new Date(p.blockedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-[120px]">{p.notes || '—'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(p)}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConnections(p)}><Link2 className="h-4 w-4 mr-2" /> Ver Conexões</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyId(p.pixelId)}><Copy className="h-4 w-4 mr-2" /> Copiar ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(p)}><Trash2 className="h-4 w-4 mr-2" /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination page={pagination.page} totalPages={totalPages} totalItems={total} pageSize={pagination.pageSize} onPageChange={p => onPaginationChange({ page: p })} onPageSizeChange={s => onPaginationChange({ pageSize: s, page: 1 })} />
    </div>
  );
}
