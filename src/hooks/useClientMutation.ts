import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { clientQuery } from '@/api/clientQuery';
import type { ClientQueryConfig } from '@/types/api.types';

type UseClientMutationOptions<TResponse, TBody, TVariables = TBody> = Omit<
  UseMutationOptions<TResponse, Error, TVariables>,
  'mutationFn'
> & {
  request: Omit<ClientQueryConfig<TBody>, 'body'>;
  prepareBody?: (variables: TVariables) => TBody | Promise<TBody>;
};

export function useClientMutation<
  TResponse,
  TBody = void,
  TVariables = TBody,
>(
  options: UseClientMutationOptions<TResponse, TBody, TVariables>,
): UseMutationResult<TResponse, Error, TVariables> {
  const { request, prepareBody, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables) => {
      const body = prepareBody
        ? await prepareBody(variables)
        : (variables as unknown as TBody);

      return clientQuery<TResponse, TBody>({
        ...request,
        body,
      });
    },
    ...mutationOptions,
  });
}
