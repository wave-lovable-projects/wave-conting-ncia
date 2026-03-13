import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, CreditCard, User, Briefcase, FileText, Target } from 'lucide-react';
import type { Supplier } from '@/types/supplier';

const assetTypeConfig: Record<string, { label: string; icon: any }> = {
  CONTAS: { label: 'Contas', icon: CreditCard },
  PERFIS: { label: 'Perfis', icon: User },
  BMS: { label: 'BMs', icon: Briefcase },
  PAGINAS: { label: 'Páginas', icon: FileText },
  PIXELS: { label: 'Pixels', icon: Target },
};

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (s: Supplier) => void;
  onDelete: (id: string) => void;
}

export function SupplierCard({ supplier, onEdit, onDelete }: SupplierCardProps) {
  const metrics = [
    { type: 'CONTAS', value: supplier.totalAccounts ?? 0 },
    { type: 'PERFIS', value: supplier.totalProfiles ?? 0 },
    { type: 'BMS', value: supplier.totalBMs ?? 0 },
    { type: 'PAGINAS', value: supplier.totalPages ?? 0 },
    { type: 'PIXELS', value: supplier.totalPixels ?? 0 },
  ].filter((m) => supplier.types.includes(m.type as any));

  return (
    <Card className="p-5 border-border hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-foreground font-semibold">{supplier.name}</h3>
          <StatusBadge status={supplier.status} className="mt-1" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(supplier)} className="gap-2">
              <Edit className="h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(supplier.id)} className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {supplier.types.map((t) => (
          <Badge key={t} variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">
            {assetTypeConfig[t]?.label ?? t}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => {
          const config = assetTypeConfig[m.type];
          const Icon = config?.icon;
          return (
            <div key={m.type} className="flex items-center gap-2 text-sm">
              {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-muted-foreground">{config?.label}:</span>
              <span className="text-foreground font-medium">{m.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
