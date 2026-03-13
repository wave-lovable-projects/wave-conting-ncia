import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockSuggestions, setMockSuggestions, getMockSuggestionComments, setMockSuggestionComments } from '@/data/mock-suggestions';
import type { Suggestion, SuggestionComment, SuggestionFilters } from '@/types/suggestion';
import { toast } from 'sonner';

export function useSuggestions(filters: SuggestionFilters) {
  return useQuery({
    queryKey: ['suggestions', filters],
    queryFn: () => {
      let data = getMockSuggestions();
      if (filters.status) data = data.filter(s => s.status === filters.status);
      if (filters.page) data = data.filter(s => s.page === filters.page);

      switch (filters.sortBy) {
        case 'votes': data.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)); break;
        case 'comments': data.sort((a, b) => b.commentsCount - a.commentsCount); break;
        default: data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
      return data;
    },
  });
}

export function useCreateSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Suggestion, 'title' | 'description' | 'page' | 'specificItem' | 'attachments'> & { authorId: string; authorName: string }) => {
      const items = getMockSuggestions();
      const newItem: Suggestion = {
        ...data,
        id: `sug-${Date.now()}`,
        status: 'PENDING',
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
      };
      setMockSuggestions([newItem, ...items]);
      return Promise.resolve(newItem);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suggestions'] }); toast.success('Sugestão enviada com sucesso!'); },
    onError: () => toast.error('Erro ao enviar sugestão'),
  });
}

export function useVoteSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vote }: { id: string; vote: 1 | -1 }) => {
      const items = getMockSuggestions();
      const idx = items.findIndex(s => s.id === id);
      if (idx === -1) return Promise.reject();
      const item = { ...items[idx] };

      // Remove previous vote
      if (item.userVote === 1) item.upvotes--;
      if (item.userVote === -1) item.downvotes--;

      if (item.userVote === vote) {
        item.userVote = null;
      } else {
        item.userVote = vote;
        if (vote === 1) item.upvotes++;
        else item.downvotes++;
      }

      items[idx] = item;
      setMockSuggestions(items);
      return Promise.resolve(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suggestions'] }),
  });
}

export function useSuggestionComments(suggestionId: string) {
  return useQuery({
    queryKey: ['suggestion-comments', suggestionId],
    queryFn: () => getMockSuggestionComments().filter(c => c.suggestionId === suggestionId),
    enabled: !!suggestionId,
  });
}

export function useCreateSuggestionComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<SuggestionComment, 'id' | 'createdAt'>) => {
      const comments = getMockSuggestionComments();
      const newComment: SuggestionComment = { ...data, id: `sc-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockSuggestionComments([...comments, newComment]);

      // Update comment count
      const suggestions = getMockSuggestions();
      const idx = suggestions.findIndex(s => s.id === data.suggestionId);
      if (idx !== -1) { suggestions[idx] = { ...suggestions[idx], commentsCount: suggestions[idx].commentsCount + 1 }; setMockSuggestions(suggestions); }

      return Promise.resolve(newComment);
    },
    onSuccess: (_, vars) => { qc.invalidateQueries({ queryKey: ['suggestion-comments', vars.suggestionId] }); qc.invalidateQueries({ queryKey: ['suggestions'] }); toast.success('Comentário adicionado'); },
    onError: () => toast.error('Erro ao adicionar comentário'),
  });
}

export function useUpdateSuggestionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Suggestion['status'] }) => {
      const items = getMockSuggestions();
      const idx = items.findIndex(s => s.id === id);
      if (idx === -1) return Promise.reject();
      items[idx] = { ...items[idx], status };
      setMockSuggestions(items);
      return Promise.resolve(items[idx]);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suggestions'] }); toast.success('Status atualizado'); },
    onError: () => toast.error('Erro ao atualizar status'),
  });
}
