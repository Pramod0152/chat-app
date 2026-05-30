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
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  profile_image?: string;
  bio?: string;
  location?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}
