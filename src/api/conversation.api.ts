import { clientQuery } from '@/api/clientQuery';
import type {
  ApiListResponse,
  ApiSingleResponse,
  Conversation,
} from '@/types/chat.types';

export function getConversationsApi(): Promise<ApiListResponse<Conversation>> {
  return clientQuery<ApiListResponse<Conversation>>({
    url: '/conversations',
  });
}

export function getConversationByIdApi(
  id: number,
): Promise<ApiSingleResponse<Conversation>> {
  return clientQuery<ApiSingleResponse<Conversation>>({
    url: '/conversations/:id',
    params: { id },
  });
}

export function createConversationApi(
  data: {
    type: 'Private' | 'Group';
    participant_ids?: number[];
    group_name?: string;
    group_image?: string;
  },
): Promise<ApiSingleResponse<Conversation>> {
  return clientQuery<ApiSingleResponse<Conversation>>({
    url: '/conversations',
    method: 'POST',
    body: data,
  });
}
