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
        'flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]',
        isOwnMessage ? 'items-end' : 'items-start',
      )}
    >
      {!isOwnMessage ? (
        <span className="text-muted-foreground px-1 text-[11px] font-semibold tracking-wide uppercase">
          {message.user?.username ?? 'Unknown'}
        </span>
      ) : null}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-sm',
          isOwnMessage
            ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-br-md'
            : 'bg-white/95 text-slate-800 ring-1 ring-slate-200 rounded-bl-md',
        )}
      >
        <span className="break-words">{message.content}</span>
        {message.is_updated ? (
          <span className="ml-2 text-[11px] opacity-80">(edited)</span>
        ) : null}
      </div>
      <span className="text-muted-foreground px-1 text-[11px] font-medium">
        {formatTime(message.created_at)}
      </span>
    </div>
  );
}
