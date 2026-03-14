import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUpdateRequest } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { Plus, X, CheckCircle, Loader2 } from 'lucide-react';
import type { Request } from '@/types/request';

interface Props { request: Request }

export function LinkedAssetsTab({ request }: Props) {
  const updateRequest = useUpdateRequest();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAssetId, setNewAssetId] = useState('');

  const linked = request.linkedAssetIds;
  const total = request.quantity;
  const isComplete = linked.length >= total;

  const handleLink = async () => {
    if (!newAssetId.trim() || linked.includes(newAssetId.trim())) return;
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        linkedAssetIds: [...linked, newAssetId.trim()],
      });
      setNewAssetId('');
      setDialogOpen(false);
      toast({ title: 'Ativo vinculado com sucesso' });
    } catch {
      toast({ title: 'Erro ao vincular ativo', variant: 'destructive' });
    }
  };

  const handleUnlink = async (assetId: string) => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        linkedAssetIds: linked.filter((id) => id !== assetId),
      });
      toast({ title: 'Ativo desvinculado' });
    } catch {
      toast({ title: 'Erro ao desvincular ativo', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {linked.length} de {total} ativos vinculados
          </span>
          {isComplete && (
            <Badge className="bg-success/20 text-success border-success/30 gap-1 text-xs">
              <CheckCircle className="h-3 w-3" />Completa
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />Vincular Ativo
        </Button>
      </div>

      {/* Asset list */}
      {linked.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Nenhum ativo vinculado ainda
        </div>
      ) : (
        <div className="space-y-2">
          {linked.map((id) => (
            <div key={id} className="flex items-center justify-between bg-surface-1 rounded-lg px-3 py-2.5">
              <div>
                <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground font-mono">{id}</Badge>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleUnlink(id)}
                disabled={updateRequest.isPending}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Link dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular Ativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-sm text-muted-foreground">ID do Ativo</label>
            <Input
              value={newAssetId}
              onChange={(e) => setNewAssetId(e.target.value)}
              placeholder="Ex: acc-001, bm-003..."
              onKeyDown={(e) => e.key === 'Enter' && handleLink()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleLink} disabled={!newAssetId.trim() || updateRequest.isPending}>
              {updateRequest.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Vincular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
