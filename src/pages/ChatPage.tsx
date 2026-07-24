import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { MessageThread } from '@/components/chat/MessageThread';
import { Separator } from '@/components/ui/separator';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Toaster } from 'react-hot-toast';
import { useChatStore } from '@/store/chat.store';

export function ChatPage() {
  useChatSocket();
  const activeConversationId = useChatStore((state) => state.activeConversationId);

  return (
    <div className="flex h-screen overflow-hidden">
      <ConversationSidebar />
      <Separator orientation="vertical" />
      <MessageThread conversationId={activeConversationId} />
      <Toaster />
    </div>
  );
}
