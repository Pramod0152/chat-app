import type { User } from '@/types/auth.types';

export interface Participant {
  id: number;
  conversation_id: number;
  user_id: number;
  last_read_message_id?: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Conversation {
  id: number;
  admin_id: number;
  type: 'Group' | 'Private';
  group_name: string | null;
  group_image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  admin?: User;
  participants?: Participant[];
}

export interface Message {
  id: number;
  conversation_id: number;
  user_id: number;
  content: string;
  is_updated: boolean;
  type: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ApiListResponse<T> {
  message: string;
  data: T[];
}

export interface ApiSingleResponse<T> {
  message: string;
  data: T;
}
