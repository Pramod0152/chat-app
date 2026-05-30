import { useQuery } from '@tanstack/react-query';

import { getUsersApi } from '@/api/user.api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsersApi,
    staleTime: 60 * 1000,
  });
}
