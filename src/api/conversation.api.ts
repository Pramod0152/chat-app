import { apiClient } from '@/api/axios.instance';
import type {
  ApiListResponse,
  ApiSingleResponse,
  Conversation,
} from '@/types/chat.types';

export async function getConversationsApi(): Promise<
  ApiListResponse<Conversation>
> {
  const response =
    await apiClient.get<ApiListResponse<Conversation>>('/conversations');
  return response.data;
}

export async function getConversationByIdApi(
  id: number,
): Promise<ApiSingleResponse<Conversation>> {
  const response = await apiClient.get<ApiSingleResponse<Conversation>>(
    `/conversations/${id}`,
  );
  return response.data;
}
