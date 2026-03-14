import type { Profile, ProfileCheckpoint, WarmingAction, ProfileAnnotation, ProfileComment, AnnotationHistoryEntry } from '@/types/profile';

let mockProfiles: Profile[] = [
  { id: 'pf-1', name: 'Perfil Admin 01', email: 'admin01@outlook.com', password: 'S3nha@Forte1', profileLink: 'https://facebook.com/profile/100001', supplierId: 's1', supplierName: 'Fornecedor Alpha', managerId: 'u1', managerName: 'João Silva', auxiliarId: 'u2', auxiliarName: 'Maria Souza', proxy: '192.168.1.100:8080', status: 'ACTIVE', receivedAt: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'pf-2', name: 'Perfil Ads 02', email: 'ads02@gmail.com', password: 'P@ssw0rd!2', profileLink: 'https://facebook.com/profile/100002', supplierId: 's2', supplierName: 'Fornecedor Beta', managerId: 'u2', managerName: 'Maria Souza', proxy: '10.0.0.5:3128', status: 'ACTIVE', receivedAt: '2024-06-15', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-10-20T10:00:00Z' },
  { id: 'pf-3', name: 'Perfil Reserva 03', email: 'reserva03@hotmail.com', password: 'R3serva#03', supplierId: 's1', supplierName: 'Fornecedor Alpha', managerId: 'u1', managerName: 'João Silva', status: 'DISABLED', receivedAt: '2024-05-01', deactivatedAt: '2024-09-15', createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-09-15T10:00:00Z' },
  { id: 'pf-4', name: 'Perfil Escala 04', email: 'escala04@outlook.com', password: 'Esc@la2024', profileLink: 'https://facebook.com/profile/100004', supplierId: 's3', supplierName: 'Fornecedor Gamma', managerId: 'u3', managerName: 'Carlos Lima', auxiliarId: 'u1', auxiliarName: 'João Silva', proxy: '172.16.0.50:9090', status: 'ACTIVE', receivedAt: '2024-07-01', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-11-10T10:00:00Z' },
  { id: 'pf-5', name: 'Perfil Bloqueado 05', email: 'blocked05@gmail.com', password: 'Bl0ck3d!5', supplierId: 's2', supplierName: 'Fornecedor Beta', managerId: 'u2', managerName: 'Maria Souza', status: 'BLOCKED', receivedAt: '2024-04-01', deactivatedAt: '2024-08-20', createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-08-20T10:00:00Z' },
  { id: 'pf-6', name: 'Perfil Aquecimento 06', email: 'warm06@outlook.com', password: 'W@rm2024!', profileLink: 'https://facebook.com/profile/100006', supplierId: 's1', supplierName: 'Fornecedor Alpha', managerId: 'u3', managerName: 'Carlos Lima', proxy: '192.168.2.200:8888', status: 'ACTIVE', receivedAt: '2024-08-01', createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
  { id: 'pf-7', name: 'Perfil Novo 07', email: 'novo07@gmail.com', password: 'N0v0Perf!7', supplierId: 's3', supplierName: 'Fornecedor Gamma', managerId: 'u1', managerName: 'João Silva', status: 'ACTIVE', receivedAt: '2024-10-01', createdAt: '2024-10-01T10:00:00Z', updatedAt: '2024-11-20T10:00:00Z' },
  { id: 'pf-8', name: 'Perfil Desativado 08', email: 'off08@hotmail.com', password: 'Off!2024#8', supplierId: 's2', supplierName: 'Fornecedor Beta', managerId: 'u2', managerName: 'Maria Souza', status: 'DISABLED', receivedAt: '2024-03-15', deactivatedAt: '2024-07-30', createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-07-30T10:00:00Z' },
];

let mockCheckpoints: ProfileCheckpoint[] = [
  { id: 'ck-1', profileId: 'pf-1', reason: 'Checkpoint de identidade', facebookReason: 'Verificação automática', attachments: [], date: '2024-09-15', createdAt: '2024-09-15T10:00:00Z' },
  { id: 'ck-2', profileId: 'pf-1', reason: 'Restrição de anúncios', facebookReason: 'Política de publicidade', attachments: [], date: '2024-10-05', createdAt: '2024-10-05T10:00:00Z' },
  { id: 'ck-3', profileId: 'pf-5', reason: 'Conta bloqueada permanente', facebookReason: 'Violação de termos', attachments: [], date: '2024-08-20', createdAt: '2024-08-20T10:00:00Z' },
];

let mockWarmingActions: WarmingAction[] = [
  { id: 'wa-1', action: 'Curtir 5 posts no feed', date: '2024-11-20', completed: true },
  { id: 'wa-2', action: 'Comentar em 2 posts de amigos', date: '2024-11-20', completed: false },
  { id: 'wa-3', action: 'Compartilhar 1 notícia', date: '2024-11-20', completed: false },
  { id: 'wa-4', action: 'Assistir 3 reels', date: '2024-11-20', completed: true },
  { id: 'wa-5', action: 'Postar story com imagem', date: '2024-11-20', completed: false },
];

let mockAnnotations: ProfileAnnotation[] = [
  { id: 'an-1', profileId: 'pf-1', content: 'Perfil estável, sem restrições recentes. Continuar com uso normal.', authorName: 'João Silva', createdAt: '2024-10-15T14:30:00Z' },
  { id: 'an-2', profileId: 'pf-1', content: 'Trocada a senha após checkpoint. Nova senha forte configurada.', authorName: 'Maria Souza', createdAt: '2024-09-20T09:15:00Z' },
];

let mockAnnotationHistory: AnnotationHistoryEntry[] = [
  { id: 'ah-1', profileId: 'pf-1', previousContent: 'Perfil em observação após checkpoint recente.', changedBy: 'João Silva', changedAt: '2024-10-10T10:00:00Z' },
  { id: 'ah-2', profileId: 'pf-1', previousContent: 'Perfil novo, aguardando aquecimento.', changedBy: 'Maria Souza', changedAt: '2024-09-15T08:00:00Z' },
];

let mockComments: ProfileComment[] = [
  { id: 'cm-1', profileId: 'pf-1', text: 'Perfil voltou ao normal após verificação.', authorName: 'João Silva', createdAt: '2024-10-16T10:00:00Z' },
  { id: 'cm-2', profileId: 'pf-1', text: 'Monitorando por mais 48h antes de escalar.', authorName: 'Maria Souza', createdAt: '2024-10-16T11:30:00Z' },
];

export function getMockProfiles() { return mockProfiles; }
export function setMockProfiles(p: Profile[]) { mockProfiles = p; }
export function getMockCheckpoints() { return mockCheckpoints; }
export function setMockCheckpoints(c: ProfileCheckpoint[]) { mockCheckpoints = c; }
export function getMockWarmingActions() { return mockWarmingActions; }
export function setMockWarmingActions(w: WarmingAction[]) { mockWarmingActions = w; }
export function getMockAnnotations() { return mockAnnotations; }
export function setMockAnnotations(a: ProfileAnnotation[]) { mockAnnotations = a; }
export function getMockAnnotationHistory() { return mockAnnotationHistory; }
export function setMockAnnotationHistory(h: AnnotationHistoryEntry[]) { mockAnnotationHistory = h; }
export function getMockComments() { return mockComments; }
export function setMockComments(c: ProfileComment[]) { mockComments = c; }
