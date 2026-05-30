import { useEffect, useRef } from 'react';

import { ComposeBox } from '@/components/chat/ComposeBox';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { SkeletonMessage } from '@/components/shared/SkeletonMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { getConversationDisplayName } from '@/lib/conversation';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';

export function MessageThread() {
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id ?? -1;

  const { data: conversationsData } = useConversations();
  const { data, isLoading, isError } = useMessages(activeConversationId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [data, activeConversationId]);

  if (activeConversationId === null) {
    return (
      <div className="text-muted-foreground flex h-full flex-1 items-center justify-center">
        Select a conversation
      </div>
    );
  }

  const activeConversation = conversationsData?.data.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const headerName = activeConversation
    ? getConversationDisplayName(activeConversation)
    : '';
  const participantCount = activeConversation?.participants?.length ?? 0;

  const messages = data?.data ? [...data.data].reverse() : [];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-0.5 p-4">
        <span className="truncate font-semibold">{headerName}</span>
        <span className="text-muted-foreground text-xs">
          {participantCount} participants
        </span>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonMessage
                key={index}
                align={index % 2 === 0 ? 'left' : 'right'}
              />
            ))
          ) : isError ? (
            <p className="text-muted-foreground text-sm">
              Failed to load messages
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={currentUserId === message.user_id}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ComposeBox />
    </div>
  );
}
