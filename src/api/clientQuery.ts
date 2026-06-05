import { apiClient } from '@/api/axios.instance';
import type {
  ClientQueryConfig,
  HttpMethod,
  PathParams,
  QueryParams,
} from '@/types/api.types';

function resolvePath(url: string, params?: PathParams): string {
  if (!params) {
    return url;
  }

  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, String(value)),
    url,
  );
}

export async function clientQuery<
  TResponse = unknown,
  TBody = unknown,
  TParams extends PathParams = PathParams,
  TQuery extends QueryParams = QueryParams,
>({
  url,
  method = 'GET',
  body,
  params,
  query,
  config,
}: ClientQueryConfig<TBody, TParams, TQuery>): Promise<TResponse> {
  const response = await apiClient.request<TResponse>({
    url: resolvePath(url, params),
    method: method as HttpMethod,
    data: body,
    params: query,
    ...config,
  });

  return response.data;
}
