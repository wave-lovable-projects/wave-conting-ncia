import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit } from 'lucide-react';
import type { Request } from '@/types/request';
import { format } from 'date-fns';

const typeLabels: Record<string, string> = {
  BM: 'BM', ACCOUNT: 'Conta', PROFILE: 'Perfil', BALANCE: 'Saldo', OTHER: 'Outro',
};

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
            <TableHead className="text-muted-foreground">Prioridade</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Solicitante</TableHead>
            <TableHead className="text-muted-foreground">Responsável</TableHead>
            <TableHead className="text-muted-foreground">Previsão</TableHead>
            <TableHead className="text-muted-foreground">Criado em</TableHead>
            <TableHead className="text-muted-foreground w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id} className="hover:bg-surface-1/50">
              <TableCell className="text-foreground font-medium">{r.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{typeLabels[r.type]}</Badge>
              </TableCell>
              <TableCell><PriorityBadge priority={r.priority} /></TableCell>
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.requesterName}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.assigneeName ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{r.dueDate ? format(new Date(r.dueDate), 'dd/MM/yyyy') : '—'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{format(new Date(r.createdAt), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(r)} className="gap-2"><Eye className="h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(r)} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
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
