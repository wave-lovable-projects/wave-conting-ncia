import { useState, useEffect, useRef, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileCheckpoints, useCreateCheckpoint, useProfileWarming, useCompleteWarmingAction, useProfileAnnotations, useCreateAnnotation, useUpdateAnnotation, useAnnotationHistory, useProfileComments, useCreateComment, useUpdateProfile } from '@/hooks/useProfiles';
import type { Profile, ProfileStatus } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Copy, Shield, Flame, MessageSquare, Plus, Send, CalendarIcon, ExternalLink, Save, Loader2, User, Globe, Key, Eye, EyeOff, Pencil, History, Package, UserCog, Users, Wifi, Clock, CalendarDays, Ban } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'DISABLED', label: 'Desativado' },
  { value: 'BLOCKED', label: 'Bloqueado' },
];

const SUPPLIER_OPTIONS = [
  { value: 's1', label: 'Fornecedor Alpha' },
  { value: 's2', label: 'Fornecedor Beta' },
  { value: 's3', label: 'Fornecedor Gamma' },
];

const MANAGER_OPTIONS = [
  { value: 'u1', label: 'João Silva' },
  { value: 'u2', label: 'Maria Souza' },
  { value: 'u3', label: 'Carlos Lima' },
];

  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
}

export function ProfileDetailSheet({ open, onOpenChange, profile }: ProfileDetailSheetProps) {
  if (!profile) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0">
        <TooltipProvider delayDuration={0}>
          <div className="p-6 space-y-6">
            <ProfileHeader profile={profile} />
            <Separator />
            <ProfileConfigGrid profile={profile} />
            <Separator />
            <AnnotationSection profileId={profile.id} />
            <Separator />
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

/* ─── Inline Editable Field ─── */
function EditableField({ value, onSave, label, mono, type = 'text' }: {
  value: string;
  onSave: (val: string) => void;
  label: string;
  mono?: boolean;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const save = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  return (
    <div
      className="group/edit flex items-center gap-1 rounded px-1.5 py-0.5 -mx-1.5 cursor-text hover:bg-muted/50 transition-colors min-h-[28px]"
      onClick={() => !editing && setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
          type={type}
          className={cn(
            'bg-transparent border-none outline-none p-0 w-full text-sm text-foreground',
            'border-b border-dashed border-primary/40 focus:border-primary',
            mono && 'font-mono'
          )}
        />
      ) : (
        <>
          <span className={cn('text-sm', mono && 'font-mono', !value && 'text-muted-foreground')}>
            {value || '—'}
          </span>
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity shrink-0" />
        </>
      )}
    </div>
  );
}

/* ─── Inline Editable Select ─── */
function EditableSelect({ value, onSave, options, renderValue }: {
  value: string;
  onSave: (val: string) => void;
  options: { value: string; label: string }[];
  renderValue?: (val: string) => React.ReactNode;
}) {
  const [selectOpen, setSelectOpen] = useState(false);
  const displayLabel = options.find(o => o.value === value)?.label || value || '—';

  return (
    <Select
      value={value}
      onValueChange={v => { onSave(v); setSelectOpen(false); }}
      open={selectOpen}
      onOpenChange={setSelectOpen}
    >
      <SelectTrigger
        className="h-auto border-none shadow-none bg-transparent hover:bg-muted/50 transition-colors px-1.5 py-0.5 -mx-1.5 gap-1 group/sel focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-0 [&>svg]:group-hover/sel:opacity-100 [&>svg]:transition-opacity"
      >
        {renderValue ? renderValue(value) : (
          <span className={cn('text-sm', !value && 'text-muted-foreground')}>{displayLabel}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

/* ─── Header ─── */
function ProfileHeader({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile();
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); toast({ title: `${label} copiado!` }); };

  const handleUpdate = (field: string, value: string) => {
    updateProfile.mutate({ id: profile.id, [field]: value } as any);
  };

  return (
    <SheetHeader className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <EditableField value={profile.name} onSave={v => handleUpdate('name', v)} label="Nome" />
            <div className="flex items-center gap-1.5 mt-0.5">
              <EditableField value={profile.email} onSave={v => handleUpdate('email', v)} label="Email" type="email" />
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
        <EditableSelect
          value={profile.status}
          onSave={v => handleUpdate('status', v)}
          options={STATUS_OPTIONS}
          renderValue={v => <StatusBadge status={v} />}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <EditableField value={profile.profileLink || ''} onSave={v => handleUpdate('profileLink', v)} label="Link do Perfil" />
        {profile.profileLink && (
          <a href={profile.profileLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs shrink-0">
            Abrir
          </a>
        )}
      </div>
    </SheetHeader>
  );
}

/* ─── Config Grid ─── */
function ProfileConfigGrid({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile();
  const [showPassword, setShowPassword] = useState(false);
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); toast({ title: `${label} copiado!` }); };

  const handleUpdate = (field: string, value: string) => {
    updateProfile.mutate({ id: profile.id, [field]: value } as any);
  };

  const items: { label: string; icon: React.ElementType; field: string; value: string; mono?: boolean; editable?: boolean }[] = [
    { label: 'Fornecedor', icon: Package, field: 'supplierName', value: profile.supplierName || '', editable: true },
    { label: 'Gestor', icon: UserCog, field: 'managerName', value: profile.managerName || '', editable: true },
    { label: 'Auxiliar', icon: Users, field: 'auxiliarName', value: profile.auxiliarName || '', editable: true },
    { label: 'Proxy', icon: Wifi, field: 'proxy', value: profile.proxy || '', mono: true, editable: true },
    { label: 'Dt. Recebimento', icon: CalendarDays, field: 'receivedAt', value: profile.receivedAt ? format(new Date(profile.receivedAt), 'dd/MM/yyyy') : '', editable: false },
    { label: 'Dt. Desativação', icon: Ban, field: 'deactivatedAt', value: profile.deactivatedAt ? format(new Date(profile.deactivatedAt), 'dd/MM/yyyy') : '', editable: false },
    { label: 'Criado em', icon: Clock, field: 'createdAt', value: format(new Date(profile.createdAt), 'dd/MM/yyyy HH:mm'), editable: false },
    { label: 'Atualizado em', icon: Clock, field: 'updatedAt', value: format(new Date(profile.updatedAt), 'dd/MM/yyyy HH:mm'), editable: false },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Configurações</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              {item.editable ? (
                <EditableField value={item.value} onSave={v => handleUpdate(item.field, v)} label={item.label} mono={item.mono} />
              ) : (
                <span className={cn('text-sm text-foreground px-1.5', item.mono && 'font-mono', !item.value && 'text-muted-foreground')}>
                  {item.value || '—'}
                </span>
              )}
            </div>
          );
        })}

        {/* Password field */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Senha</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono px-1.5">{showPassword ? profile.password : '••••••••'}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copy(profile.password, 'Senha')}>
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copiar senha</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Single Annotation with History ─── */
function AnnotationSection({ profileId }: { profileId: string }) {
  const { data: annotations } = useProfileAnnotations(profileId);
  const { data: history } = useAnnotationHistory(profileId);
  const createAnnotation = useCreateAnnotation();
  const updateAnnotation = useUpdateAnnotation();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground">Anotação</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setHistoryOpen(true)}>
              <History className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Histórico de alterações</TooltipContent>
        </Tooltip>
        <div className="flex-1" />
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
        <div className="flex justify-end mt-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
            Salvar
          </Button>
        </div>
      )}

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Alterações</DialogTitle>
            <DialogDescription>Versões anteriores da anotação deste perfil</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {(!history || history.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma alteração registrada.</p>
            ) : (
              history.map(h => (
                <div key={h.id} className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{h.changedBy}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(h.changedAt), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{h.previousContent}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
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
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> Registrar Checkpoint</Button>
      </div>
      <div className="space-y-3">
        {checkpoints?.map(cp => (
          <div key={cp.id} className="rounded-lg border border-border p-3">
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
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} />
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
          <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
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
          <div key={c.id} className="rounded-lg border border-border p-3">
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
