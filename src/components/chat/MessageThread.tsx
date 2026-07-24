'use client'

import { useMessages } from '@/hooks/useMessages'
import { useConversations } from '@/hooks/useConversations'
import { useAuthStore } from '@/store/auth.store'
import { useChatStore } from '@/store/chat.store'
import { MessageBubble } from './MessageBubble'
import { ComposeBox } from './ComposeBox'
import { useEffect, useRef } from 'react'

interface MessageThreadProps {
  conversationId?: number | null
}

export function MessageThread({ conversationId = null }: MessageThreadProps) {
  const { data, isLoading, isError } = useMessages(conversationId)
  const { data: conversationsData } = useConversations()
  const currentUser = useAuthStore((state) => state.user)
  const currentUserId = currentUser?.id ?? -1
  const typingUsersMap = useChatStore((state) => state.typingUsers)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = conversationsData?.data.find((c) => c.id === conversationId)

  const messages = data?.data ? [...data.data].reverse() : []
  const typingUserIds = conversationId !== null ? (typingUsersMap[conversationId] ?? []) : []
  const typingUserIdsFiltered = typingUserIds.filter((id) => id !== currentUserId)
  const typingUsernames = typingUserIdsFiltered
    .map((id) => conversation?.participants?.find((p) => p.user_id === id)?.user?.username)
    .filter((n): n is string => Boolean(n))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [conversationId, data, typingUsernames.length])

  if (!conversationId) {
    return (
      <div className="text-muted-foreground flex h-full flex-1 items-center justify-center">
        Select a conversation
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 bg-white/70 px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm">
            {conversation?.group_name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-bold tracking-tight text-slate-900">
              {conversation?.group_name ?? 'Direct Message'}
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {conversation?.type === 'Group' ? `${conversation?.participants?.length ?? 0} members` : 'Private'}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          {isLoading ? (
            <p className="text-muted-foreground">Loading messages…</p>
          ) : isError ? (
            <p className="text-muted-foreground">Failed to load messages</p>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.user_id === currentUserId}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm font-medium">No messages yet</p>
          )}

          {/* typing indicator */}
          {typingUsernames.length > 0 && (
            <div className="flex items-start">
              <div className="bg-white/95 text-muted-foreground max-w-sm rounded-2xl rounded-bl-md px-4 py-3 text-[15px] italic shadow-sm ring-1 ring-slate-200">
                {typingUsernames.join(', ')} {typingUsernames.length > 1 ? 'are' : 'is'} typing…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ComposeBox />
    </div>
  )
}
