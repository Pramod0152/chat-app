import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { connectSocket, disconnectSocket } from '@/api/socket';
import { getToken } from '@/lib/token';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { useSocketStore } from '@/store/socket.store';
import type {
  ApiListResponse,
  Conversation,
  Message,
} from '@/types/chat.types';

export function useChatSocket(): void {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const incrementUnread = useChatStore((state) => state.incrementUnread);
  const setConnected = useSocketStore((state) => state.setConnected);

  const activeConversationIdRef = useRef<number | null>(activeConversationId);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    const socket = connectSocket(token);

    const handleMessage = (message: Message) => {
      if (message.conversation_id === activeConversationIdRef.current) {
        queryClient.setQueryData<ApiListResponse<Message>>(
          ['messages', message.conversation_id],
          (old) => {
            if (!old) {
              return old;
            }
            if (old.data.some((m) => m.id === message.id)) {
              return old;
            }
            return { ...old, data: [message, ...old.data] };
          },
        );
      }

      queryClient.setQueryData<ApiListResponse<Conversation>>(
        ['conversations'],
        (old) => {
          if (!old) {
            return old;
          }
          const target = old.data.find(
            (conversation) => conversation.id === message.conversation_id,
          );
          if (!target) {
            return old;
          }
          const updatedConversation: Conversation = {
            ...target,
            last_message: message,
          };
          const rest = old.data.filter(
            (conversation) => conversation.id !== message.conversation_id,
          );
          return { ...old, data: [updatedConversation, ...rest] };
        },
      );

      if (message.conversation_id !== activeConversationIdRef.current) {
        incrementUnread(message.conversation_id);
      }
    };

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => {
      console.error(err.message);
      setConnected(false);
    });
    socket.on('on-message-received', handleMessage);

    return () => {
      socket.off('on-message-received', handleMessage);
      disconnectSocket();
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}
