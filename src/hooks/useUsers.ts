import { useClientQuery } from '@/hooks/useClientQuery';
import type { User } from '@/types/auth.types';
import type { ApiListResponse } from '@/types/chat.types';

export function useUsers() {
  return useClientQuery<ApiListResponse<User>>({
    queryKey: ['users'],
    request: {
      url: '/users',
    },
    staleTime: 60 * 1000,
  });
}
