import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { getConversationDisplayName } from "@/lib/conversation";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import { SkeletonMessage } from "@/components/shared/SkeletonMessage";
import { ComposeBox } from "./ComposeBox";
import { MessageBubble } from "./MessageBubble";

export function MessageThread() {
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id ?? -1;

  const { data: conversationsData } = useConversations();
  const { data, isLoading, isError } = useMessages(activeConversationId);

  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. activeConversation must be defined BEFORE anything that reads it
  const activeConversation = conversationsData?.data.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const headerName = activeConversation
    ? getConversationDisplayName(activeConversation)
    : 'Conversation';
  const participantCount = activeConversation?.participants?.length ?? 0;

  // 2. typing indicator logic goes here, AFTER activeConversation exists
  const typingUsersMap = useChatStore((state) => state.typingUsers);
  const typingUserIds =
    activeConversationId !== null
      ? (typingUsersMap[activeConversationId] ?? []).filter(
          (userId) => userId !== currentUserId,
        )
      : [];

  const typingUsernames = typingUserIds
    .map(
      (id) =>
        activeConversation?.participants?.find((p) => p.user_id === id)?.user
          ?.username,
    )
    .filter((username): username is string => Boolean(username));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [activeConversationId, data, typingUsernames.length]);

  if (activeConversationId === null) {
    return (
      <div className="text-muted-foreground flex h-full flex-1 items-center justify-center">
        Select a conversation
      </div>
    );
  }

  const messages = data?.data ? [...data.data].reverse() : [];
  const isTyping = typingUsernames.length > 0;

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/60">
      <div className="border-b border-slate-200/70 bg-white/70 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/55">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm">
            {headerName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-bold tracking-tight text-slate-900">
              {headerName}
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {participantCount} member{participantCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-5 px-5 py-6 sm:px-6">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonMessage
                  key={index}
                  align={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          ) : isError ? (
            <p className="text-muted-foreground text-sm">
              Failed to load messages
            </p>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.user_id === currentUserId}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm font-medium">
              No messages yet
            </p>
          )}

          {isTyping ? (
            <div className="flex items-start">
              <div className="bg-white/95 text-muted-foreground max-w-sm rounded-2xl rounded-bl-md px-4 py-3 text-[15px] italic shadow-sm ring-1 ring-slate-200">
                {typingUsernames.join(", ")} {typingUsernames.length > 1 ? "are" : "is"} typing…
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ComposeBox />
    </div>
  );
}