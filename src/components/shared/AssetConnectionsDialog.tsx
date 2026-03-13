import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Building2, UserCircle, FileText, Crosshair } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  type: string;
  relation: string;
  status: string;
}

interface AssetConnectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetName: string;
}

const mockConnections: Record<string, Connection[]> = {
  'Business Managers': [
    { id: 'bm1', name: 'BM Principal', type: 'BM', relation: 'Vinculada', status: 'ACTIVE' },
  ],
  'Perfis': [
    { id: 'p1', name: 'Perfil Admin 01', type: 'Perfil', relation: 'Proprietário', status: 'ACTIVE' },
  ],
  'Páginas': [
    { id: 'pg1', name: 'Página Loja X', type: 'Página', relation: 'Associada', status: 'ACTIVE' },
  ],
  'Pixels': [
    { id: 'px1', name: 'Pixel Principal', type: 'Pixel', relation: 'Instalado', status: 'ACTIVE' },
    { id: 'px2', name: 'Pixel Backup', type: 'Pixel', relation: 'Instalado', status: 'DISABLED' },
  ],
};

const typeIcons: Record<string, typeof Building2> = {
  'Business Managers': Building2,
  'Perfis': UserCircle,
  'Páginas': FileText,
  'Pixels': Crosshair,
};

export function AssetConnectionsDialog({ open, onOpenChange, assetName }: AssetConnectionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Conexões de {assetName}</DialogTitle>
          <DialogDescription>Ativos vinculados a esta conta de anúncio</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-auto">
          {Object.entries(mockConnections).map(([group, items]) => {
            const Icon = typeIcons[group] || Building2;
            return (
              <div key={group}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">{group}</h4>
                </div>
                <div className="space-y-1.5 pl-6">
                  {items.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-md bg-surface-1 px-3 py-2">
                      <div>
                        <p className="text-sm text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.relation}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
