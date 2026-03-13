import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CellWithHistory } from '@/components/shared/CellWithHistory';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { MoreHorizontal, Copy, Pencil, AlertTriangle, Link2, Trash2, ArrowUpDown } from 'lucide-react';
import type { AdAccount, AdAccountPagination } from '@/types/ad-account';
import { toast } from '@/hooks/use-toast';

const paymentLabels: Record<string, string> = { CREDIT: 'Crédito', DEBIT: 'Débito', BOLETO: 'Boleto', PIX: 'Pix' };

interface Props {
  data: AdAccount[];
  total: number;
  totalPages: number;
  pagination: AdAccountPagination;
  onPaginationChange: (p: Partial<AdAccountPagination>) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (account: AdAccount) => void;
  onDelete: (account: AdAccount) => void;
  onViewConnections: (account: AdAccount) => void;
}

export function AdAccountsTable({
  data, total, totalPages, pagination, onPaginationChange,
  selectedIds, onSelectionChange, sortField, sortDir, onSort,
  onEdit, onDelete, onViewConnections,
}: Props) {
  const allSelected = data.length > 0 && data.every((a) => selectedIds.has(a.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((a) => a.id)));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectionChange(next);
  };

  const copyId = (accountId: string) => {
    navigator.clipboard.writeText(accountId);
    toast({ title: 'ID copiado', description: accountId });
  };

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(field)}>
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );

  return (
    <div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1 hover:bg-surface-1">
              <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
              <TableHead><SortHeader field="name">Nome</SortHeader></TableHead>
              <TableHead><SortHeader field="accountId">ID da Conta</SortHeader></TableHead>
              <TableHead><SortHeader field="supplierName">Fornecedor</SortHeader></TableHead>
              <TableHead><SortHeader field="bmName">BM</SortHeader></TableHead>
              <TableHead><SortHeader field="niche">Nicho</SortHeader></TableHead>
              <TableHead>Produto</TableHead>
              <TableHead><SortHeader field="managerName">Gestor</SortHeader></TableHead>
              <TableHead>Status Conta</TableHead>
              <TableHead>Status BM</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Cartão</TableHead>
              <TableHead>Uso</TableHead>
              <TableHead className="w-12 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={16} className="text-center py-12 text-muted-foreground">Nenhuma conta encontrada</TableCell></TableRow>
            ) : data.map((a) => (
              <TableRow key={a.id} className={selectedIds.has(a.id) ? 'bg-surface-2' : ''}>
                <TableCell><Checkbox checked={selectedIds.has(a.id)} onCheckedChange={() => toggle(a.id)} /></TableCell>
                <TableCell className="font-medium text-foreground whitespace-nowrap">{a.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-mono text-xs">{a.accountId}</span>
                    <button onClick={() => copyId(a.accountId)} className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{a.supplierName || '—'}</TableCell>
                <TableCell className="text-sm">{a.bmName || '—'}</TableCell>
                <TableCell className="text-sm">{a.niche || '—'}</TableCell>
                <TableCell className="text-sm">{a.product || '—'}</TableCell>
                <TableCell className="text-sm">{a.managerName || '—'}</TableCell>
                <TableCell>
                  <CellWithHistory accountId={a.id} field="accountStatus">
                    <StatusBadge status={a.accountStatus} />
                  </CellWithHistory>
                </TableCell>
                <TableCell>
                  {a.bmStatus ? (
                    <CellWithHistory accountId={a.id} field="bmStatus">
                      <StatusBadge status={a.bmStatus} />
                    </CellWithHistory>
                  ) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={a.balanceRemoved ? 'bg-warning/15 text-warning border-warning/30' : 'bg-surface-2 text-muted-foreground border-border'}>
                    {a.balanceRemoved ? 'Sim' : 'Não'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{a.paymentType ? paymentLabels[a.paymentType] || a.paymentType : '—'}</TableCell>
                <TableCell className="text-sm">{a.bank || '—'}</TableCell>
                <TableCell className="text-sm font-mono">{a.cardLast4 ? `••${a.cardLast4}` : '—'}</TableCell>
                <TableCell><StatusBadge status={a.usageStatus} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(a)}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem><AlertTriangle className="h-4 w-4 mr-2" /> Registrar Incidente</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewConnections(a)}><Link2 className="h-4 w-4 mr-2" /> Ver Conexões</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyId(a.accountId)}><Copy className="h-4 w-4 mr-2" /> Copiar ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(a)}><Trash2 className="h-4 w-4 mr-2" /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        page={pagination.page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pagination.pageSize}
        onPageChange={(p) => onPaginationChange({ page: p })}
        onPageSizeChange={(s) => onPaginationChange({ pageSize: s, page: 1 })}
      />
    </div>
  );
}
