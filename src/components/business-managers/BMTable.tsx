import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoreHorizontal, Copy, Pencil, Link2, Trash2, ArrowUpDown, Building2 } from 'lucide-react';
import type { BusinessManager, BMPagination } from '@/types/business-manager';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BMTableProps {
  data: BusinessManager[];
  total: number;
  totalPages: number;
  pagination: BMPagination;
  onPaginationChange: (p: Partial<BMPagination>) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (bm: BusinessManager) => void;
  onDelete: (bm: BusinessManager) => void;
  onViewConnections: (bm: BusinessManager) => void;
}

function SortHeader({ field, label, sortField, sortDir, onSort }: { field: string; label: string; sortField: string | null; sortDir: string; onSort: (f: string) => void }) {
  return (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(field)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );
}

export function BMTable({ data, total, totalPages, pagination, onPaginationChange, selectedIds, onSelectionChange, sortField, sortDir, onSort, onEdit, onDelete, onViewConnections }: BMTableProps) {
  if (data.length === 0) return <EmptyState title="Nenhuma BM encontrada" description="Ajuste os filtros ou crie uma nova Business Manager." icon={Building2} />;

  const copyId = (id: string) => { navigator.clipboard.writeText(id); toast({ title: 'BM ID copiado!' }); };

  const allSelected = data.length > 0 && data.every(bm => selectedIds.has(bm.id));
  const toggleAll = () => {
    if (allSelected) onSelectionChange(new Set());
    else onSelectionChange(new Set(data.map(bm => bm.id)));
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
              <TableHead><SortHeader field="name" label="Nome" sortField={sortField} sortDir={sortDir} onSort={onSort} /></TableHead>
              <TableHead>BM ID</TableHead>
              <TableHead><SortHeader field="function" label="Função" sortField={sortField} sortDir={sortDir} onSort={onSort} /></TableHead>
              <TableHead>Status</TableHead>
              <TableHead><SortHeader field="supplierName" label="Fornecedor" sortField={sortField} sortDir={sortDir} onSort={onSort} /></TableHead>
              <TableHead>Gestores</TableHead>
              <TableHead>Dt. Recebimento</TableHead>
              <TableHead>Dt. Block</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(bm => (
              <TableRow key={bm.id} className="group/row" data-state={selectedIds.has(bm.id) ? 'selected' : undefined}>
                <TableCell><Checkbox checked={selectedIds.has(bm.id)} onCheckedChange={() => toggleOne(bm.id)} /></TableCell>
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-1">
                    <span>{bm.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onEdit(bm)}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewConnections(bm)}><Link2 className="h-4 w-4 mr-2" /> Ver Conexões</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyId(bm.bmId)}><Copy className="h-4 w-4 mr-2" /> Copiar ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(bm)}><Trash2 className="h-4 w-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono text-muted-foreground">{bm.bmId}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyId(bm.bmId)}><Copy className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{bm.function}</Badge></TableCell>
                <TableCell><StatusBadge status={bm.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{bm.supplierName || '—'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {bm.gestores.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
                    {bm.gestores.map(g => <Badge key={g.id} variant="secondary" className="text-xs">{g.name}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{bm.receivedAt ? format(new Date(bm.receivedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{bm.blockedAt ? format(new Date(bm.blockedAt), 'dd/MM/yyyy') : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        page={pagination.page} totalPages={totalPages} totalItems={total} pageSize={pagination.pageSize}
        onPageChange={p => onPaginationChange({ page: p })} onPageSizeChange={s => onPaginationChange({ pageSize: s, page: 1 })}
      />
    </div>
  );
}
