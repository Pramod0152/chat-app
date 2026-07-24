'use client'

import type { Message } from '@/types/chat.types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showSenderName?: boolean
}

export function MessageBubble({ message, isOwn, showSenderName = false }: MessageBubbleProps) {
  function formatTime(date: string): string {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  const timeAgo = formatTime(message.created_at)

  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col gap-1 max-w-xs sm:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {showSenderName && !isOwn && (
          <p className="text-xs font-medium text-muted-foreground px-3 leading-none">{message.user?.username || 'Unknown'}</p>
        )}

        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-secondary text-secondary-foreground rounded-bl-sm'
            }`}
        >
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
          <span>{timeAgo}</span>
          {message.is_updated && <span className="italic">(edited)</span>}
        </div>
      </div>
    </div>
  )
}
