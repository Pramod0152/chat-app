import { apiClient } from '@/api/axios.instance';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth.types';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/register',
    payload,
  );
  return response.data;
}
