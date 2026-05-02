import { create } from 'zustand';
import api from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  pagination: null,
  loadingConversations: false,
  loadingMessages: false,
  sendingMessage: false,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const { data } = await api.get('/conversations');
      set({ conversations: data.data, loadingConversations: false });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      set({ loadingConversations: false });
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation, messages: [], pagination: null });
  },

  fetchMessages: async (conversationId, page = 1) => {
    set({ loadingMessages: true });
    try {
      const { data } = await api.get(`/messages/${conversationId}?page=${page}&limit=50`);
      if (page === 1) {
        set({ messages: data.data, pagination: data.pagination, loadingMessages: false });
      } else {
        set((state) => ({
          messages: [...data.data, ...state.messages],
          pagination: data.pagination,
          loadingMessages: false,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      set({ loadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.some(
        (m) => m._id === message._id || (m.tempId && m.tempId === message.tempId)
      );
      if (exists) {
        return {
          messages: state.messages.map((m) =>
            (m.tempId && m.tempId === message.tempId) ? message : m
          ),
        };
      }
      return { messages: [...state.messages, message] };
    });

    // Update conversation list
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === message.conversationId
          ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
          : conv
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    }));
  },

  addOptimisticMessage: (tempMessage) => {
    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));
  },

  createConversation: async (participantId) => {
    try {
      const { data } = await api.post('/conversations', { participantId });
      const conversation = data.data;
      set((state) => {
        const exists = state.conversations.some((c) => c._id === conversation._id);
        if (exists) return {};
        return { conversations: [conversation, ...state.conversations] };
      });
      return conversation;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      return null;
    }
  },

  updateUnreadCount: (conversationId, unreadCount) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount } : conv
      ),
    }));
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  },

  updateMessageStatus: (conversationId, status) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.conversationId === conversationId) {
          if (status === 'read') return { ...msg, read: true, delivered: true };
          if (status === 'delivered') return { ...msg, delivered: true };
        }
        return msg;
      }),
    }));
  },
}));

export default useChatStore;
