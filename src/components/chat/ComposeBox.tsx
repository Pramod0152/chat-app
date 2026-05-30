import { useEffect, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '@/hooks/useSendMessage';

export function ComposeBox() {
  const { content, setContent, sendMessage, isSending, canSend } =
    useSendMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (content === '') {
      textareaRef.current?.focus();
    }
  }, [content]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t px-4 py-3">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        placeholder="Write a message..."
        className="max-h-[120px] min-h-0 flex-1 resize-none overflow-y-auto"
      />
      <Button
        type="button"
        size="icon"
        onClick={sendMessage}
        disabled={!canSend}
        className="disabled:opacity-50"
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </Button>
    </div>
  );
}
