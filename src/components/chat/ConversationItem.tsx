import { getConversationDisplayName } from '@/lib/conversation';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/chat.types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: number;
  unreadCount: number;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  unreadCount,
}: ConversationItemProps) {
  const displayName = getConversationDisplayName(conversation);
  const initial = displayName.charAt(0).toUpperCase() || '?';
  const secondaryText =
    conversation.type === 'Group'
      ? `${conversation.participants?.length ?? 0} members`
      : 'Private';
  const showBadge = unreadCount > 0 && !isActive;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:bg-accent/50',
        isActive && 'bg-accent',
      )}
    >
      <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
        {initial}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{displayName}</span>
        <span className="text-muted-foreground truncate text-xs">
          {secondaryText}
        </span>
        {conversation.last_message?.content ? (
          <span className="text-muted-foreground truncate text-sm">
            {conversation.last_message.content}
          </span>
        ) : null}
      </div>
      {showBadge ? (
        <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </button>
  );
}
