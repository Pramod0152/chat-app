import { create } from 'zustand';

interface ChatState {
  activeConversationId: number | null;
  setActiveConversationId: (id: number) => void;
  clearActiveConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  clearActiveConversation: () => set({ activeConversationId: null }),
}));
