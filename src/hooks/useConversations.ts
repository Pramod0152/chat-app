import { useClientQuery } from '@/hooks/useClientQuery';
import type { ApiListResponse, Conversation } from '@/types/chat.types';

export function useConversations() {
  return useClientQuery<ApiListResponse<Conversation>>({
    queryKey: ['conversations'],
    request: {
      url: '/conversations',
    },
    staleTime: 30 * 1000,
  });
}
