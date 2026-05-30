import { apiClient } from '@/api/axios.instance';
import type { User } from '@/types/auth.types';
import type { ApiListResponse } from '@/types/chat.types';

export async function getMeApi(): Promise<{ message: string; data: User }> {
  const response = await apiClient.get<{ message: string; data: User }>(
    '/users/me',
  );
  return response.data;
}

export async function getUsersApi(): Promise<ApiListResponse<User>> {
  const response = await apiClient.get<ApiListResponse<User>>('/api/v1/users');
  return response.data;
}
