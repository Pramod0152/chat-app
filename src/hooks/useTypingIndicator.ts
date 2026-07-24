import { useCallback, useEffect, useRef } from "react";
import { getSocket } from "@/api/socket";

const TYPING_TIMEOUT_MS = 2000;

export function useTypingIndicator(conversationId: number | null) {
  const isTypingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = useCallback(() => {
    if (!isTypingRef.current || conversationId === null) return;
    getSocket()?.emit("typing", {
      conversation_id: conversationId,
      isTyping: false,
    });
    isTypingRef.current = false;
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    if (conversationId === null) return;
    const socket = getSocket();
    if (!socket) return;

    if (!isTypingRef.current) {
      socket.emit("typing", {
        conversation_id: conversationId,
        isTyping: true,
      });
      isTypingRef.current = true;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(stopTyping, TYPING_TIMEOUT_MS);
  }, [conversationId, stopTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopTyping();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return { notifyTyping, stopTyping };
}
