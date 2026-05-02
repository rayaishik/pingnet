import { create } from 'zustand';

const useSocketStore = create((set) => ({
  socket: null,
  connected: false,
  onlineUsers: [],
  typingUsers: {},

  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ connected }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.includes(userId)
        ? state.onlineUsers
        : [...state.onlineUsers, userId],
    })),

  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((id) => id !== userId),
    })),

  setUserTyping: (conversationId, userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: isTyping
          ? [...(state.typingUsers[conversationId] || []).filter((id) => id !== userId), userId]
          : (state.typingUsers[conversationId] || []).filter((id) => id !== userId),
      },
    })),

  clearTyping: () => set({ typingUsers: {} }),
}));

export default useSocketStore;
