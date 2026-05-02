module.exports = {
  // Client → Server
  USER_ONLINE: 'user:online',
  JOIN_CONVERSATION: 'join:conversation',
  SEND_MESSAGE: 'send:message',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  MESSAGE_READ: 'message:read',

  // Server → Client
  RECEIVE_MESSAGE: 'receive:message',
  USER_TYPING: 'user:typing',
  USER_STATUS_ONLINE: 'user:online',
  USER_STATUS_OFFLINE: 'user:offline',
  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_READ_RECEIPT: 'message:read',
  UNREAD_UPDATE: 'unread:update',
};
