import type { Suggestion, SuggestionComment } from '@/types/suggestion';

let mockSuggestions: Suggestion[] = [
  { id: 'sug-1', title: 'Adicionar filtro por data na tabela de contas', description: 'Seria muito útil poder filtrar as contas de anúncio por data de criação ou última atualização. Atualmente só conseguimos filtrar por status e fornecedor, mas muitas vezes precisamos encontrar contas criadas em um período específico.', page: '/contas', attachments: [], status: 'PENDING', authorId: 'u2', authorName: 'Carlos Silva', upvotes: 8, downvotes: 1, userVote: null, commentsCount: 3, createdAt: '2025-03-10T10:00:00Z' },
  { id: 'sug-2', title: 'Exportar relatórios em PDF', description: 'Precisamos de uma funcionalidade para exportar os dados das tabelas em formato PDF, principalmente para reuniões com clientes e relatórios gerenciais.', page: '/bms', attachments: [], status: 'ANALYZING', authorId: 'u3', authorName: 'Ana Oliveira', upvotes: 12, downvotes: 0, userVote: 1, commentsCount: 5, createdAt: '2025-03-08T14:00:00Z' },
  { id: 'sug-3', title: 'Notificações por email quando conta é bloqueada', description: 'Quando uma conta de anúncio ou BM é bloqueada, seria importante receber uma notificação por email para agir rapidamente.', attachments: [], status: 'IN_PROGRESS', authorId: 'u4', authorName: 'Rafael Santos', upvotes: 15, downvotes: 2, userVote: null, commentsCount: 7, createdAt: '2025-03-05T09:00:00Z' },
  { id: 'sug-4', title: 'Dashboard com métricas de performance', description: 'Um dashboard visual com gráficos mostrando a performance geral das contas, taxa de bloqueio, tempo médio de vida das contas, etc.', page: '/meta', attachments: [], status: 'DONE', authorId: 'u5', authorName: 'Juliana Costa', upvotes: 20, downvotes: 1, userVote: -1, commentsCount: 10, createdAt: '2025-02-20T10:00:00Z' },
  { id: 'sug-5', title: 'Modo escuro aprimorado', description: 'O modo escuro atual está bom, mas alguns elementos ficam com contraste baixo. Sugestão de revisar os badges e alguns textos secundários.', attachments: [], status: 'REJECTED', authorId: 'u6', authorName: 'Mariana Lima', upvotes: 3, downvotes: 5, userVote: null, commentsCount: 2, createdAt: '2025-02-15T16:00:00Z' },
  { id: 'sug-6', title: 'Atalhos de teclado para ações comuns', description: 'Implementar atalhos de teclado como Ctrl+N para novo, Ctrl+F para filtrar, etc. Iria agilizar bastante o trabalho diário.', page: '/', attachments: [], status: 'PENDING', authorId: 'u2', authorName: 'Carlos Silva', upvotes: 6, downvotes: 0, userVote: null, commentsCount: 1, createdAt: '2025-03-11T08:00:00Z' },
  { id: 'sug-7', title: 'Integração com Slack para alertas', description: 'Enviar alertas automáticos para um canal do Slack quando eventos importantes acontecem, como bloqueios de conta ou BMs.', attachments: [], status: 'ANALYZING', authorId: 'u3', authorName: 'Ana Oliveira', upvotes: 9, downvotes: 1, userVote: 1, commentsCount: 4, createdAt: '2025-03-09T11:00:00Z' },
  { id: 'sug-8', title: 'Bulk edit para múltiplas contas', description: 'Poder selecionar várias contas de anúncio e editar campos em lote, como alterar o status, fornecedor ou gestor de todas de uma vez.', page: '/', attachments: [], status: 'PENDING', authorId: 'u4', authorName: 'Rafael Santos', upvotes: 11, downvotes: 0, userVote: null, commentsCount: 3, createdAt: '2025-03-12T07:00:00Z' },
];

let mockSuggestionComments: SuggestionComment[] = [
  { id: 'sc-1', suggestionId: 'sug-1', text: 'Concordo totalmente, isso economizaria muito tempo!', authorId: 'u3', authorName: 'Ana Oliveira', createdAt: '2025-03-10T11:00:00Z' },
  { id: 'sc-2', suggestionId: 'sug-1', text: 'Poderia incluir um date range picker para facilitar.', authorId: 'u4', authorName: 'Rafael Santos', createdAt: '2025-03-10T12:00:00Z' },
  { id: 'sc-3', suggestionId: 'sug-1', text: 'Já está no backlog, vamos priorizar.', authorId: 'u1', authorName: 'Admin Wave', createdAt: '2025-03-10T14:00:00Z' },
  { id: 'sc-4', suggestionId: 'sug-2', text: 'PDF é essencial para as reuniões semanais.', authorId: 'u5', authorName: 'Juliana Costa', createdAt: '2025-03-08T15:00:00Z' },
  { id: 'sc-5', suggestionId: 'sug-2', text: 'Além de PDF, CSV também seria útil.', authorId: 'u2', authorName: 'Carlos Silva', createdAt: '2025-03-08T16:00:00Z' },
];

export function getMockSuggestions() { return [...mockSuggestions]; }
export function setMockSuggestions(s: Suggestion[]) { mockSuggestions = s; }
export function getMockSuggestionComments() { return [...mockSuggestionComments]; }
export function setMockSuggestionComments(c: SuggestionComment[]) { mockSuggestionComments = c; }
