import { useClientQuery } from '@/hooks/useClientQuery';
import type { ApiListResponse, Message } from '@/types/chat.types';

export function useMessages(conversationId: number | null) {
  return useClientQuery<ApiListResponse<Message>>({
    queryKey: ['messages', conversationId],
    request: {
      url: '/messages',
      query: { conversation_id: conversationId as number },
    },
    enabled: conversationId !== null,
    staleTime: 0,
  });
}
