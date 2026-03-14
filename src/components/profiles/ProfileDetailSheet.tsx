import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileCheckpoints, useCreateCheckpoint, useProfileWarming, useCompleteWarmingAction, useProfileAnnotations, useCreateAnnotation, useUpdateAnnotation, useProfileComments, useCreateComment } from '@/hooks/useProfiles';
import type { Profile } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Copy, Shield, Flame, MessageSquare, Plus, Send, CalendarIcon, ExternalLink, Save, Loader2, User, Globe, Key } from 'lucide-react';

interface ProfileDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
}

export function ProfileDetailSheet({ open, onOpenChange, profile }: ProfileDetailSheetProps) {
  if (!profile) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0">
        <TooltipProvider delayDuration={300}>
          <div className="p-6 space-y-6">
            {/* Header */}
            <ProfileHeader profile={profile} />

            <Separator />

            {/* Config grid */}
            <ProfileConfigGrid profile={profile} />

            <Separator />

            {/* Single annotation */}
            <AnnotationSection profileId={profile.id} />

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="checkpoints" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="checkpoints"><Shield className="h-4 w-4 mr-1.5" /> Checkpoints</TabsTrigger>
                <TabsTrigger value="warming"><Flame className="h-4 w-4 mr-1.5" /> Aquecimento</TabsTrigger>
                <TabsTrigger value="comments"><MessageSquare className="h-4 w-4 mr-1.5" /> Comentários</TabsTrigger>
              </TabsList>

              <TabsContent value="checkpoints" className="mt-4"><CheckpointsTab profileId={profile.id} /></TabsContent>
              <TabsContent value="warming" className="mt-4"><WarmingTab profileId={profile.id} /></TabsContent>
              <TabsContent value="comments" className="mt-4"><CommentsTab profileId={profile.id} /></TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Header ─── */
function ProfileHeader({ profile }: { profile: Profile }) {
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); toast({ title: `${label} copiado!` }); };

  return (
    <SheetHeader className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <SheetTitle className="text-xl">{profile.name}</SheetTitle>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-muted-foreground truncate">{profile.email}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copy(profile.email, 'Email')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar email</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <StatusBadge status={profile.status} />
      </div>
      {profile.profileLink && (
        <a href={profile.profileLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Abrir perfil no Facebook
        </a>
      )}
    </SheetHeader>
  );
}

/* ─── Config Grid ─── */
function ProfileConfigGrid({ profile }: { profile: Profile }) {
  const items = [
    { label: 'Fornecedor', value: profile.supplierName },
    { label: 'Gestor', value: profile.managerName },
    { label: 'Auxiliar', value: profile.auxiliarName },
    { label: 'Proxy', value: profile.proxy, mono: true },
    { label: 'Dt. Recebimento', value: profile.receivedAt ? format(new Date(profile.receivedAt), 'dd/MM/yyyy') : undefined },
    { label: 'Dt. Desativação', value: profile.deactivatedAt ? format(new Date(profile.deactivatedAt), 'dd/MM/yyyy') : undefined },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Configurações</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className={cn('text-sm text-foreground', item.mono && 'font-mono', !item.value && 'text-muted-foreground')}>
              {item.value || '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Single Annotation ─── */
function AnnotationSection({ profileId }: { profileId: string }) {
  const { data: annotations } = useProfileAnnotations(profileId);
  const createAnnotation = useCreateAnnotation();
  const updateAnnotation = useUpdateAnnotation();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const existing = annotations?.[0];

  useEffect(() => {
    if (existing && !isEditing) {
      setContent(existing.content);
    }
  }, [existing, isEditing]);

  const handleSave = async () => {
    if (!content.trim()) return;
    if (existing) {
      await updateAnnotation.mutateAsync({ id: existing.id, profileId, content });
    } else {
      await createAnnotation.mutateAsync({ profileId, content, authorName: 'Usuário Atual' });
    }
    setIsEditing(false);
    toast({ title: 'Anotação salva' });
  };

  const isSaving = createAnnotation.isPending || updateAnnotation.isPending;
  const hasChanges = existing ? content !== existing.content : content.trim().length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Anotação</h3>
        {existing && !isEditing && (
          <span className="text-xs text-muted-foreground">
            Atualizado em {format(new Date(existing.createdAt), 'dd/MM/yyyy HH:mm')}
          </span>
        )}
      </div>
      <Textarea
        placeholder="Escreva uma anotação sobre este perfil..."
        value={content}
        onChange={e => { setContent(e.target.value); setIsEditing(true); }}
        className="min-h-[80px] resize-none"
      />
      {hasChanges && (
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="mt-2">
          {isSaving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
          Salvar
        </Button>
      )}
    </div>
  );
}

/* ─── Checkpoints Tab ─── */
function CheckpointsTab({ profileId }: { profileId: string }) {
  const { data: checkpoints } = useProfileCheckpoints(profileId);
  const createCheckpoint = useCreateCheckpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [fbReason, setFbReason] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleCreate = async () => {
    if (!reason || !date) return;
    await createCheckpoint.mutateAsync({ profileId, reason, facebookReason: fbReason || undefined, attachments: [], date: format(date, 'yyyy-MM-dd') });
    toast({ title: 'Checkpoint registrado' });
    setDialogOpen(false);
    setReason(''); setFbReason(''); setDate(undefined);
  };

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> Registrar Checkpoint</Button>
      <div className="space-y-3">
        {checkpoints?.map(cp => (
          <div key={cp.id} className="rounded-lg bg-surface-1 p-3 border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{cp.reason}</span>
              <span className="text-xs text-muted-foreground">{format(new Date(cp.date), 'dd/MM/yyyy')}</span>
            </div>
            {cp.facebookReason && <p className="text-xs text-muted-foreground">Facebook: {cp.facebookReason}</p>}
          </div>
        ))}
        {checkpoints?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum checkpoint registrado.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Checkpoint</DialogTitle>
            <DialogDescription>Registre uma restrição ou desativação do perfil</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Motivo *</Label><Input value={reason} onChange={e => setReason(e.target.value)} /></div>
            <div><Label>Motivo do Facebook</Label><Input value={fbReason} onChange={e => setFbReason(e.target.value)} /></div>
            <div>
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal mt-1', !date && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={!reason || !date || createCheckpoint.isPending}>
                {createCheckpoint.isPending && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Warming Tab ─── */
function WarmingTab({ profileId }: { profileId: string }) {
  const { data: actions } = useProfileWarming(profileId);
  const completeAction = useCompleteWarmingAction();

  const handleToggle = async (actionId: string, completed: boolean) => {
    await completeAction.mutateAsync({ actionId, completed, profileId });
  };

  const completedCount = actions?.filter(a => a.completed).length ?? 0;
  const totalCount = actions?.length ?? 0;

  return (
    <div className="space-y-4">
      {totalCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{completedCount}/{totalCount}</span>
        </div>
      )}
      <div className="space-y-2">
        {actions?.map(a => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3 border border-border">
            <Checkbox checked={a.completed} onCheckedChange={(v) => handleToggle(a.id, !!v)} />
            <span className={cn('text-sm', a.completed ? 'line-through text-muted-foreground' : 'text-foreground')}>{a.action}</span>
          </div>
        ))}
        {totalCount === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ação de aquecimento.</p>}
      </div>
    </div>
  );
}

/* ─── Comments Tab ─── */
function CommentsTab({ profileId }: { profileId: string }) {
  const { data: comments } = useProfileComments(profileId);
  const createComment = useCreateComment();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    await createComment.mutateAsync({ profileId, text, authorName: 'Usuário Atual' });
    setText('');
    toast({ title: 'Comentário enviado' });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {comments?.map(c => (
          <div key={c.id} className="rounded-lg bg-surface-1 p-3 border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{c.authorName}</span>
              <span className="text-xs text-muted-foreground">{format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
        {comments?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda.</p>}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Escreva um comentário..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <Button onClick={handleSend} disabled={!text.trim() || createComment.isPending}>
          {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
