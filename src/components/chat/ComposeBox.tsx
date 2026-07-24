import { useEffect, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useChatStore } from '@/store/chat.store';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '@/hooks/useSendMessage';

export function ComposeBox() {
  const { content, setContent, sendMessage, isSending, canSend } =
    useSendMessage();
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const { notifyTyping, stopTyping } = useTypingIndicator(activeConversationId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    stopTyping();
    sendMessage();
  };

  useEffect(() => {
    if (content === '') {
      textareaRef.current?.focus();
    }
  }, [content]);

  return (
    <div className="border-t border-slate-200/80 bg-white/70 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={content}
        disabled={isSending}
        placeholder="Write a message..."
        className="max-h-[140px] min-h-0 flex-1 resize-none overflow-y-auto rounded-2xl border-slate-200 bg-white/90 px-4 py-3 text-[15px] shadow-sm placeholder:text-slate-400 focus-visible:ring-sky-400"
        onChange={(event) => {
          setContent(event.target.value);
          notifyTyping();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!canSend}
        className="size-11 shrink-0 rounded-2xl bg-sky-500 text-white shadow-md transition-all hover:bg-sky-600 disabled:opacity-50"
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </Button>
      </div>
    </div>
  );
}
