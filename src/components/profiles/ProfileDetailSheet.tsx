import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useProfileCheckpoints, useCreateCheckpoint, useProfileWarming, useCompleteWarmingAction, useProfileAnnotations, useCreateAnnotation, useProfileComments, useCreateComment } from '@/hooks/useProfiles';
import type { Profile } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { MessageSquare, FileText, Shield, Flame, Plus, Send } from 'lucide-react';

interface ProfileDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
}

export function ProfileDetailSheet({ open, onOpenChange, profile }: ProfileDetailSheetProps) {
  if (!profile) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{profile.name}</SheetTitle>
          <SheetDescription>{profile.email}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="annotations" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="annotations"><FileText className="h-4 w-4 mr-1" /> Anotações</TabsTrigger>
            <TabsTrigger value="checkpoints"><Shield className="h-4 w-4 mr-1" /> Checkpoints</TabsTrigger>
            <TabsTrigger value="warming"><Flame className="h-4 w-4 mr-1" /> Aquecimento</TabsTrigger>
            <TabsTrigger value="comments"><MessageSquare className="h-4 w-4 mr-1" /> Comentários</TabsTrigger>
          </TabsList>

          <TabsContent value="annotations" className="mt-4"><AnnotationsTab profileId={profile.id} /></TabsContent>
          <TabsContent value="checkpoints" className="mt-4"><CheckpointsTab profileId={profile.id} /></TabsContent>
          <TabsContent value="warming" className="mt-4"><WarmingTab profileId={profile.id} /></TabsContent>
          <TabsContent value="comments" className="mt-4"><CommentsTab profileId={profile.id} /></TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function AnnotationsTab({ profileId }: { profileId: string }) {
  const { data: annotations } = useProfileAnnotations(profileId);
  const createAnnotation = useCreateAnnotation();
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    await createAnnotation.mutateAsync({ profileId, content, authorName: 'Usuário Atual' });
    setContent('');
    toast({ title: 'Anotação salva' });
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea placeholder="Escreva uma anotação..." value={content} onChange={e => setContent(e.target.value)} className="min-h-[100px]" />
        <Button onClick={handleSave} className="mt-2" disabled={!content.trim()}><Plus className="h-4 w-4 mr-1" /> Salvar Anotação</Button>
      </div>
      <div className="space-y-3">
        {annotations?.map(a => (
          <div key={a.id} className="rounded-lg bg-surface-1 p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{a.authorName}</span>
              <span className="text-xs text-muted-foreground">{format(new Date(a.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
          </div>
        ))}
        {annotations?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma anotação ainda.</p>}
      </div>
    </div>
  );
}

function CheckpointsTab({ profileId }: { profileId: string }) {
  const { data: checkpoints } = useProfileCheckpoints(profileId);
  const createCheckpoint = useCreateCheckpoint();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [fbReason, setFbReason] = useState('');
  const [date, setDate] = useState('');

  const handleCreate = async () => {
    if (!reason || !date) return;
    await createCheckpoint.mutateAsync({ profileId, reason, facebookReason: fbReason || undefined, attachments: [], date });
    toast({ title: 'Checkpoint registrado' });
    setDialogOpen(false);
    setReason(''); setFbReason(''); setDate('');
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> Registrar Checkpoint</Button>
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
            <div><Label>Data *</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={!reason || !date}>Registrar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WarmingTab({ profileId }: { profileId: string }) {
  const { data: actions } = useProfileWarming(profileId);
  const completeAction = useCompleteWarmingAction();
  const [newAction, setNewAction] = useState('');

  const handleToggle = async (actionId: string, completed: boolean) => {
    await completeAction.mutateAsync({ actionId, completed, profileId });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {actions?.map(a => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3 border border-border">
            <Checkbox checked={a.completed} onCheckedChange={(v) => handleToggle(a.id, !!v)} />
            <span className={`text-sm ${a.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{a.action}</span>
          </div>
        ))}
        {actions?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ação de aquecimento.</p>}
      </div>
    </div>
  );
}

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
        <Button onClick={handleSend} disabled={!text.trim()}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
