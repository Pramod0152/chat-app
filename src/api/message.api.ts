import { clientQuery } from '@/api/clientQuery';
import type { ApiListResponse, Message } from '@/types/chat.types';

export function getMessagesApi(
  conversation_id: number,
): Promise<ApiListResponse<Message>> {
  return clientQuery<ApiListResponse<Message>>({
    url: '/messages',
    query: { conversation_id },
  });
}

export function getAiSummaryApi(
  conversation_id: number,
): Promise<{ summary: string }> {
  return clientQuery<{ summary: string }>({
    url: '/summary',
    query: { conversation_id },
  });
}
