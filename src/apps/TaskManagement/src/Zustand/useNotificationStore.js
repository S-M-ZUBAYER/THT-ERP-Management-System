import { create } from "zustand";
export const useNotificationStore = create((set, get) => ({
  unreadCount: 0,
  messages: [],
  seenMessageIds: new Set(
    JSON.parse(localStorage.getItem("seenMessageIds") || "[]")
  ),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [msg, ...state.messages],
      unreadCount: state.unreadCount + 1,
    })),

  setMessages: (msgs) => {
    const seenIds = get().seenMessageIds;
    const sortedMessages = msgs.sort((a, b) => b.id - a.id);
    const unreadMessages = sortedMessages.filter((msg) => !seenIds.has(msg.id));

    set({
      messages: sortedMessages,
      unreadCount: unreadMessages.length,
    });
  },

  markAsRead: (id) => {
    const seen = new Set(get().seenMessageIds);
    if (!seen.has(id)) {
      seen.add(id);
      localStorage.setItem("seenMessageIds", JSON.stringify([...seen]));
      const unread = get().messages.filter((msg) => !seen.has(msg.id)).length;
      set({ seenMessageIds: seen, unreadCount: unread });
    }
  },

  clearUnread: () => {
    const seen = new Set(get().messages.map((m) => m.id));
    localStorage.setItem("seenMessageIds", JSON.stringify([...seen]));
    set({ seenMessageIds: seen, unreadCount: 0 });
  },
}));
