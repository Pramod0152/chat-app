import { useState } from 'react';
import { Plus } from 'lucide-react';

import { ConversationItem } from '@/components/chat/ConversationItem';
import { NewChatDialog } from '@/components/chat/NewChatDialog';
import { NewGroupDialog } from '@/components/chat/NewGroupDialog';
import { SkeletonConversation } from '@/components/shared/SkeletonConversation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useConversations } from '@/hooks/useConversations';
import useLogout from '@/hooks/useLogout';
import { getConversationDisplayName } from '@/lib/conversation';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';

export function ConversationSidebar() {
  const currentUser = useAuthStore((state) => state.user);
  const logout = useLogout();
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

  const conversations = data?.data ?? [];
  const filteredConversations = conversations.filter((conversation) =>
    getConversationDisplayName(conversation)
      .toLowerCase()
      .includes(filter.trim().toLowerCase()),
  );

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {currentUser?.username.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="truncate text-[15px] font-bold tracking-tight">
            {currentUser?.username ?? 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="New chat or group">
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <NewChatDialog trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>New Chat</DropdownMenuItem>} />
              <NewGroupDialog trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>New Group</DropdownMenuItem>} />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={logout}
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
      </div>

      <Separator />

      <div className="px-4 py-3">
        <Input
          type="text"
          placeholder="Search conversations"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 px-2 pb-3">
        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonConversation key={index} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted-foreground px-3 py-4 text-sm">
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
