import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket';
import useAuthStore from '../store/useAuthStore';
import useSocketStore from '../store/useSocketStore';
import useChatStore from '../store/useChatStore';

const useSocket = () => {
  const { token, user } = useAuthStore();
  const { setSocket, setConnected, setOnlineUsers, addOnlineUser, removeOnlineUser, setUserTyping } = useSocketStore();
  const { addMessage, updateUnreadCount, updateMessageStatus } = useChatStore();
  const socketRef = useRef(null);

  const setupSocket = useCallback(() => {
    if (!token || !user) return;

    const socket = connectSocket(token);
    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('user:online');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('online:users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('user:online', ({ userId }) => {
      addOnlineUser(userId);
    });

    socket.on('user:offline', ({ userId }) => {
      removeOnlineUser(userId);
    });

    socket.on('receive:message', ({ message }) => {
      addMessage(message);
    });

    socket.on('user:typing', ({ userId, conversationId, isTyping }) => {
      setUserTyping(conversationId, userId, isTyping);
    });

    socket.on('message:delivered', ({ conversationId }) => {
      updateMessageStatus(conversationId, 'delivered');
    });

    socket.on('message:read', ({ conversationId }) => {
      updateMessageStatus(conversationId, 'read');
    });

    socket.on('unread:update', ({ conversationId, unreadCount }) => {
      updateUnreadCount(conversationId, unreadCount);
    });

    return socket;
  }, [token, user]);

  useEffect(() => {
    const socket = setupSocket();
    return () => {
      if (socket) {
        disconnectSocket();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [setupSocket]);

  return socketRef.current;
};

export default useSocket;
