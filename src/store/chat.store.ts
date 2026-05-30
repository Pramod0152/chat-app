import { create } from 'zustand';

interface ChatState {
  activeConversationId: number | null;
  unreadCounts: Record<number, number>;
  setActiveConversationId: (id: number) => void;
  clearActiveConversation: () => void;
  incrementUnread: (conversationId: number) => void;
  clearUnread: (conversationId: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeConversationId: null,
  unreadCounts: {},
  setActiveConversationId: (id) =>
    set((state) => ({
      activeConversationId: id,
      unreadCounts: { ...state.unreadCounts, [id]: 0 },
    })),
  clearActiveConversation: () => set({ activeConversationId: null }),
  incrementUnread: (conversationId) => {
    if (conversationId === get().activeConversationId) {
      return;
    }
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] ?? 0) + 1,
      },
    }));
  },
  clearUnread: (conversationId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: 0 },
    })),
}));
