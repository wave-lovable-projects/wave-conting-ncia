import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoreHorizontal, Copy, Pencil, Link2, Trash2, ArrowUpDown, FileText } from 'lucide-react';
import type { FacebookPage, PagePagination } from '@/types/page';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PageTableProps {
  data: FacebookPage[];
  total: number;
  totalPages: number;
  pagination: PagePagination;
  onPaginationChange: (p: Partial<PagePagination>) => void;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (p: FacebookPage) => void;
  onDelete: (p: FacebookPage) => void;
  onViewConnections: (p: FacebookPage) => void;
}

function SortHeader({ field, label, sortField, onSort }: { field: string; label: string; sortField: string | null; onSort: (f: string) => void }) {
  return (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(field)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );
}

export function PageTable({ data, total, totalPages, pagination, onPaginationChange, sortField, sortDir, onSort, onEdit, onDelete, onViewConnections }: PageTableProps) {
  if (data.length === 0) return <EmptyState title="Nenhuma página encontrada" description="Ajuste os filtros ou crie uma nova página." icon={FileText} />;

  const copyId = (id: string) => { navigator.clipboard.writeText(id); toast({ title: 'Page ID copiado!' }); };

  return (
    <div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1 hover:bg-surface-1">
              <TableHead><SortHeader field="name" label="Nome" sortField={sortField} onSort={onSort} /></TableHead>
              <TableHead>Page ID</TableHead>
              <TableHead>BM Vinculada</TableHead>
              <TableHead>BM Origem</TableHead>
              <TableHead><SortHeader field="supplierName" label="Fornecedor" sortField={sortField} onSort={onSort} /></TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dt. Recebimento</TableHead>
              <TableHead>Dt. Block</TableHead>
              <TableHead>Dt. Uso</TableHead>
              <TableHead>Gestor</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="w-[60px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono text-muted-foreground">{p.pageId}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyId(p.pageId)}><Copy className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.bmName || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.originBmId || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.supplierName || '—'}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.receivedAt ? format(new Date(p.receivedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.blockedAt ? format(new Date(p.blockedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.usedAt ? format(new Date(p.usedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.managerName || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-[120px]">{p.notes || '—'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(p)}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConnections(p)}><Link2 className="h-4 w-4 mr-2" /> Ver Conexões</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyId(p.pageId)}><Copy className="h-4 w-4 mr-2" /> Copiar ID</DropdownMenuItem>
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
