import { clientQuery } from '@/api/clientQuery';
import type {
  ApiListResponse,
  ApiSingleResponse,
  Participant,
} from '@/types/chat.types';

export function getParticipantsByConversationIdApi(
  conversationId: number,
  params?: { limit?: number; cursor?: number },
): Promise<ApiListResponse<Participant>> {
  return clientQuery<ApiListResponse<Participant>>({
    url: '/participants',
    query: { conversation_id: conversationId, ...params },
  });
}

export function createParticipantApi(
  data: {
    conversation_id: number;
    user_id: number;
  },
): Promise<ApiSingleResponse<Participant>> {
  return clientQuery<ApiSingleResponse<Participant>>({
    url: '/participants',
    method: 'POST',
    body: data,
  });
}
