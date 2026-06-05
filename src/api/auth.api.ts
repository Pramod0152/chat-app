import { clientQuery } from '@/api/clientQuery';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SsoLoginPayload,
} from '@/types/auth.types';

export function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return clientQuery<AuthResponse, LoginPayload>({
    url: '/auth/login',
    method: 'POST',
    body: payload,
  });
}

export function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  return clientQuery<AuthResponse, RegisterPayload>({
    url: '/auth/register',
    method: 'POST',
    body: payload,
  });
}

export function ssoLoginApi(payload: SsoLoginPayload): Promise<AuthResponse> {
  return clientQuery<AuthResponse, SsoLoginPayload>({
    url: '/auth/sso-login',
    method: 'POST',
    body: payload,
  });
}
