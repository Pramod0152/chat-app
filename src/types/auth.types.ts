export interface User {
  id: number;
  username: string;
  email?: string;
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  fcm_token?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  profile_image?: string;
  bio?: string;
  location?: string;
}

export interface SsoLoginPayload {
  sso_token: string;
  fcm_token?: string;
  device_id: string;
  device_type: string;
  version: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}
