import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { MessageThread } from '@/components/chat/MessageThread';
import { Separator } from '@/components/ui/separator';

function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <ConversationSidebar />
      <Separator orientation="vertical" />
      <MessageThread />
    </div>
  );
}

export default ChatPage;
