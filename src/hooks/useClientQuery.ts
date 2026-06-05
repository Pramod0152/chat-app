import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { clientQuery } from '@/api/clientQuery';
import type { ClientQueryConfig } from '@/types/api.types';

type UseClientQueryOptions<TResponse> = Omit<
  UseQueryOptions<TResponse, Error>,
  'queryKey' | 'queryFn'
> & {
  queryKey: QueryKey;
  request: ClientQueryConfig;
};

export function useClientQuery<TResponse>(
  options: UseClientQueryOptions<TResponse>,
): UseQueryResult<TResponse, Error> {
  const { queryKey, request, ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: () => clientQuery<TResponse>(request),
    ...queryOptions,
  });
}
