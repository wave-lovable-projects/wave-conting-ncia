import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useCreateSuggestion } from '@/hooks/useSuggestions';
import { useUIStore } from '@/store/ui.store';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function FloatingSuggestionButton() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = useUIStore(s => s.user);
  const createSuggestion = useCreateSuggestion();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState('');
  const [specificItem, setSpecificItem] = useState('');

  const handleOpen = () => {
    setPage(location.pathname);
    setOpen(true);
  };

  const reset = () => { setTitle(''); setDescription(''); setPage(''); setSpecificItem(''); };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !user) return;
    createSuggestion.mutate({
      title: title.trim(),
      description: description.trim(),
      page: page || undefined,
      specificItem: specificItem || undefined,
      attachments: [],
      authorId: user.id,
      authorName: user.name,
    }, { onSuccess: () => { setOpen(false); reset(); } });
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleOpen}
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Enviar sugestão</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nova Sugestão</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resumo da sugestão" />
            </div>
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva sua sugestão em detalhes..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Página relacionada</Label>
              <Input value={page} onChange={e => setPage(e.target.value)} placeholder="/pagina" />
            </div>
            <div className="space-y-2">
              <Label>Item específico</Label>
              <Input value={specificItem} onChange={e => setSpecificItem(e.target.value)} placeholder="Ex: Botão de exportar" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !description.trim() || createSuggestion.isPending}>
              {createSuggestion.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
