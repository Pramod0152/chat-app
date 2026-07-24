import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { MessageThread } from '@/components/chat/MessageThread';
import { Separator } from '@/components/ui/separator';
import { useChatSocket } from '@/hooks/useChatSocket';
import { messaging } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function ChatPage() {
  useChatSocket();
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification?.body ?? '');
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <ConversationSidebar />
      <Separator orientation="vertical" />
      <MessageThread />
      <Toaster />
    </div>
  );
}

export default ChatPage;
