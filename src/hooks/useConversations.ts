import { useQuery } from '@tanstack/react-query';

import { getConversationsApi } from '@/api/conversation.api';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversationsApi,
    staleTime: 30 * 1000,
  });
}
