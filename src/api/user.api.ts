import { clientQuery } from '@/api/clientQuery';
import type { User } from '@/types/auth.types';
import type { ApiListResponse } from '@/types/chat.types';

export function getMeApi(): Promise<{ message: string; data: User }> {
  return clientQuery<{ message: string; data: User }>({
    url: '/users/me',
  });
}

export function getUsersApi(): Promise<ApiListResponse<User>> {
  return clientQuery<ApiListResponse<User>>({
    url: '/users',
  });
}
