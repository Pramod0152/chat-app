import { getConversationDisplayName } from '@/lib/conversation';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/chat.types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: number;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const displayName = getConversationDisplayName(conversation);
  const initial = displayName.charAt(0).toUpperCase() || '?';
  const secondaryText =
    conversation.type === 'Group'
      ? `${conversation.participants?.length ?? 0} members`
      : 'Private';

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
      </div>
    </button>
  );
}
