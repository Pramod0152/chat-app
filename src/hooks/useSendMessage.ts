import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getSocket } from '@/api/socket';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import type { ApiListResponse, Message } from '@/types/chat.types';

interface UseSendMessageResult {
  content: string;
  setContent: (value: string) => void;
  sendMessage: () => void;
  isSending: boolean;
  canSend: boolean;
}

export function useSendMessage(): UseSendMessageResult {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );

  const [content, setContent] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const canSend =
    content.trim().length > 0 && !isSending && activeConversationId !== null;

  const sendMessage = () => {
    if (!canSend || activeConversationId === null) {
      return;
    }

    const trimmed = content.trim();

    const socket = getSocket();
    if (!socket) {
      console.warn('Socket not connected');
      return;
    }

    setIsSending(true);
    socket.emit('send-message', {
      conversation_id: activeConversationId,
      content: trimmed,
      type: 'Text',
    });

    if (currentUser) {
      const now = new Date().toISOString();
      const ownMessage: Message = {
        id: Date.now(),
        conversation_id: activeConversationId,
        user_id: currentUser.id,
        content: trimmed,
        is_updated: false,
        type: 'Text',
        created_at: now,
        updated_at: now,
        user: currentUser,
      };

      queryClient.setQueryData<ApiListResponse<Message>>(
        ['messages', activeConversationId],
        (old) => {
          if (!old) {
            return { message: '', data: [ownMessage] };
          }
          return { ...old, data: [ownMessage, ...old.data] };
        },
      );
    }

    setContent('');
    setIsSending(false);
  };

  return { content, setContent, sendMessage, isSending, canSend };
}
