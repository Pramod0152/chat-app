 'use client'

import { useEffect, useRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import { useSendMessage } from '@/hooks/useSendMessage'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { useChatStore } from '@/store/chat.store'
import { Button } from '@/components/ui/button'

export function ComposeBox() {
  const { content, setContent, sendMessage, isSending, canSend } = useSendMessage()
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const { notifyTyping, stopTyping } = useTypingIndicator(activeConversationId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (content === '') textareaRef.current?.focus()
  }, [content])

  const handleSend = () => {
    stopTyping()
    sendMessage()
  }

  return (
    <div className="flex items-end gap-2 border-t px-4 py-3">
      <textarea
        ref={textareaRef}
        rows={1}
        value={content}
        disabled={isSending}
        placeholder="Write a message..."
        className="max-h-[120px] min-h-0 flex-1 resize-none overflow-y-auto"
        onChange={(event) => {
          setContent(event.target.value)
          notifyTyping()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSend()
          }
        }}
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!canSend}
        className="disabled:opacity-50"
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </Button>
    </div>
  )
}
