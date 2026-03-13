export type SuggestionStatus = 'PENDING' | 'ANALYZING' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  PENDING: 'Pendente',
  ANALYZING: 'Analisando',
  IN_PROGRESS: 'Em Andamento',
  DONE: 'Concluída',
  REJECTED: 'Rejeitada',
};

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  page?: string;
  specificItem?: string;
  attachments: string[];
  status: SuggestionStatus;
  authorId: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | null;
  commentsCount: number;
  createdAt: string;
}

export interface SuggestionComment {
  id: string;
  suggestionId: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface SuggestionFilters {
  status?: string;
  page?: string;
  sortBy?: 'votes' | 'recent' | 'comments';
}
