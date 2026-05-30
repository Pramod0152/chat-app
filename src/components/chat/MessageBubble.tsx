import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat.types';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        isOwnMessage ? 'items-end' : 'items-start',
      )}
    >
      {!isOwnMessage ? (
        <span className="text-muted-foreground px-1 text-xs font-medium">
          {message.user?.username ?? 'Unknown'}
        </span>
      ) : null}
      <div
        className={cn(
          'max-w-xs rounded-lg px-3 py-2 text-sm sm:max-w-sm',
          isOwnMessage
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        <span className="break-words">{message.content}</span>
        {message.is_updated ? (
          <span className="text-muted-foreground ml-1 text-xs">(edited)</span>
        ) : null}
      </div>
      <span className="text-muted-foreground px-1 text-xs">
        {formatTime(message.created_at)}
      </span>
    </div>
  );
}
