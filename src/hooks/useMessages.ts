import { useQuery } from '@tanstack/react-query';

import { getMessagesApi } from '@/api/message.api';

export function useMessages(conversationId: number | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessagesApi(conversationId as number),
    enabled: conversationId !== null,
    staleTime: 0,
  });
}
