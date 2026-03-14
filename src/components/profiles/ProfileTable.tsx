import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoreHorizontal, Copy, Pencil, Link2, Trash2, ArrowUpDown, Eye, EyeOff, UserCircle, ExternalLink } from 'lucide-react';
import type { Profile, ProfilePagination } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ProfileTableProps {
  data: Profile[];
  total: number;
  totalPages: number;
  pagination: ProfilePagination;
  onPaginationChange: (p: Partial<ProfilePagination>) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  sortField: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (p: Profile) => void;
  onDelete: (p: Profile) => void;
  onViewDetails: (p: Profile) => void;
  onViewConnections: (p: Profile) => void;
}

function SortHeader({ field, label, sortField, onSort }: { field: string; label: string; sortField: string | null; onSort: (f: string) => void }) {
  return (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(field)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );
}

export function ProfileTable({ data, total, totalPages, pagination, onPaginationChange, selectedIds, onSelectionChange, sortField, sortDir, onSort, onEdit, onDelete, onViewDetails, onViewConnections }: ProfileTableProps) {
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());

  if (data.length === 0) return <EmptyState title="Nenhum perfil encontrado" description="Ajuste os filtros ou crie um novo perfil." icon={UserCircle} />;

  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); toast({ title: `${label} copiado!` }); };
  const toggleReveal = (id: string) => setRevealedPasswords(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

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
    <TooltipProvider delayDuration={300}>
      <div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-1 hover:bg-surface-1">
                <TableHead className="w-[40px]"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                <TableHead><SortHeader field="name" label="Nome" sortField={sortField} onSort={onSort} /></TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead><SortHeader field="supplierName" label="Fornecedor" sortField={sortField} onSort={onSort} /></TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Auxiliar</TableHead>
                <TableHead>Proxy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dt. Recebimento</TableHead>
                <TableHead>Dt. Desativação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(p => {
                const showPw = revealedPasswords.has(p.id);
                return (
                  <TableRow key={p.id} className="group/row" data-state={selectedIds.has(p.id) ? 'selected' : undefined}>
                    <TableCell><Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleOne(p.id)} /></TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-1">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => onViewDetails(p)}
                        >
                          {p.name}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => onEdit(p)}><Pencil className="h-4 w-4 mr-2" /> Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewDetails(p)}><ExternalLink className="h-4 w-4 mr-2" /> Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewConnections(p)}><Link2 className="h-4 w-4 mr-2" /> Ver Conexões</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(p)}><Trash2 className="h-4 w-4 mr-2" /> Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground truncate max-w-[140px]">{p.email}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity" onClick={() => copy(p.email, 'Email')}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar email</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono text-muted-foreground">{showPw ? p.password : '••••••••'}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity" onClick={() => toggleReveal(p.id)}>
                              {showPw ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{showPw ? 'Ocultar senha' : 'Mostrar senha'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity" onClick={() => copy(p.password, 'Senha')}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar senha</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.supplierName || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.managerName || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.auxiliarName || '—'}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{p.proxy || '—'}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.receivedAt ? format(new Date(p.receivedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.deactivatedAt ? format(new Date(p.deactivatedAt), 'dd/MM/yyyy') : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination
          page={pagination.page} totalPages={totalPages} totalItems={total} pageSize={pagination.pageSize}
          onPageChange={p => onPaginationChange({ page: p })} onPageSizeChange={s => onPaginationChange({ pageSize: s, page: 1 })}
        />
      </div>
    </TooltipProvider>
  );
}
