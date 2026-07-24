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
        'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-sky-50/80',
        isActive && 'bg-sky-100/90 shadow-sm ring-1 ring-sky-200',
      )}
    >
      <div className="bg-gradient-to-br from-slate-200 to-slate-100 text-slate-700 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-inner">
        {initial}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-bold tracking-tight">{displayName}</span>
        <span className="text-muted-foreground truncate text-xs font-medium">
          {secondaryText}
        </span>
        {conversation.last_message?.content ? (
          <span className="text-muted-foreground truncate text-sm leading-5">
            {conversation.last_message.content}
          </span>
        ) : null}
      </div>
      {showBadge ? (
        <span className="bg-sky-500 text-white flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </button>
  );
}
