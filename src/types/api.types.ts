import type { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type PathParams = Record<string, string | number>;

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface ClientQueryConfig<
  TBody = unknown,
  TParams extends PathParams = PathParams,
  TQuery extends QueryParams = QueryParams,
> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  params?: TParams;
  query?: TQuery;
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
