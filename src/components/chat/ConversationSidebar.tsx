import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConversationItem } from '@/components/chat/ConversationItem';
import { SkeletonConversation } from '@/components/shared/SkeletonConversation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useConversations } from '@/hooks/useConversations';
import { getConversationDisplayName } from '@/lib/conversation';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';

export function ConversationSidebar() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const setActiveConversationId = useChatStore(
    (state) => state.setActiveConversationId,
  );
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  const [filter, setFilter] = useState('');
  const { data, isLoading, isError } = useConversations();

  const currentUserId = currentUser?.id ?? -1;

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const conversations = data?.data ?? [];
  const filteredConversations = conversations.filter((conversation) =>
    getConversationDisplayName(conversation)
      .toLowerCase()
      .includes(filter.trim().toLowerCase()),
  );

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col">
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {currentUser?.username.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="truncate font-semibold">
            {currentUser?.username ?? 'Unknown'}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </Button>
      </div>

      <Separator />

      <div className="p-3">
        <Input
          type="text"
          placeholder="Search conversations"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonConversation key={index} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted-foreground p-3 text-sm">
            Failed to load conversations
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onClick={() => setActiveConversationId(conversation.id)}
              currentUserId={currentUserId}
              unreadCount={unreadCounts[conversation.id] ?? 0}
            />
          ))
        )}
      </ScrollArea>
    </aside>
  );
}
