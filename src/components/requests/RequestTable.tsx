import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';
import type { Request } from '@/types/request';
import { REQUEST_TYPE_LABELS } from '@/types/request';
import { format } from 'date-fns';

interface Props {
  requests: Request[];
  onView: (r: Request) => void;
  onEdit: (r: Request) => void;
}

export function RequestTable({ requests, onView, onEdit }: Props) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-1 hover:bg-surface-1">
            <TableHead className="text-muted-foreground">Título</TableHead>
            <TableHead className="text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-muted-foreground">Qtd</TableHead>
            <TableHead className="text-muted-foreground">Prioridade</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Solicitante</TableHead>
            <TableHead className="text-muted-foreground">Fornecedor</TableHead>
            <TableHead className="text-muted-foreground">Previsão</TableHead>
            <TableHead className="text-muted-foreground">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id} className="hover:bg-surface-1/50 group/row">
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-1">
                  <span>{r.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => onView(r)} className="gap-2"><Eye className="h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(r)} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{REQUEST_TYPE_LABELS[r.assetType]}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.quantityDelivered}/{r.quantity}</TableCell>
              <TableCell><PriorityBadge priority={r.priority} /></TableCell>
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.requesterName}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.supplierName ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.dueDate ? format(new Date(r.dueDate), 'dd/MM/yyyy') : '—'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{format(new Date(r.createdAt), 'dd/MM/yyyy')}</TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">Nenhuma solicitação encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
