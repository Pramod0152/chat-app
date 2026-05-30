import { apiClient } from '@/api/axios.instance';
import type { ApiListResponse, Message } from '@/types/chat.types';

export async function getMessagesApi(
  conversation_id: number,
): Promise<ApiListResponse<Message>> {
  const response = await apiClient.get<ApiListResponse<Message>>(
    `/messages?conversation_id=${conversation_id}`,
  );
  return response.data;
}
