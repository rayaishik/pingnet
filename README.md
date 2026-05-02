<p align="center">
  <img src="https://img.shields.io/badge/PingNet-v1.0.0-6c5ce7?style=for-the-badge&labelColor=0a0a0f" alt="PingNet" />
</p>

<h1 align="center">🚀 PingNet</h1>
<h3 align="center">A Production-Grade, Real-Time Messaging Application</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" />
</p>

<p align="center">
  A full-stack, scalable messaging platform built with <strong>React</strong>, <strong>Node.js</strong>, <strong>MongoDB</strong>, <strong>Redis</strong>, and <strong>Socket.io</strong>.<br/>
  Features real-time chat, typing indicators, read receipts, online/offline tracking, and a modern dark UI inspired by Discord &amp; WhatsApp.
</p>

---

## 📸 Screenshots

| Registration | Chat Dashboard |
|:---:|:---:|
| ![Register](https://i.imgur.com/placeholder1.png) | ![Dashboard](https://i.imgur.com/placeholder2.png) |

| User Search | Real-Time Chat |
|:---:|:---:|
| ![Search](https://i.imgur.com/placeholder3.png) | ![Chat](https://i.imgur.com/placeholder4.png) |

> **Note:** Replace the placeholder URLs above with actual screenshots from your deployment.

---

## ✨ Features

### 🔐 Authentication
- User registration & login with **JWT** tokens
- Password hashing with **bcrypt** (12 salt rounds)
- Persistent login via localStorage
- Protected routes on both frontend and backend
- Auto-logout on token expiration

### 💬 Real-Time Chat
- **One-to-one private messaging** with instant delivery
- **Typing indicators** with animated dots
- **Online/offline status** tracked in real-time via Redis
- **Read receipts** (✓ sent, ✓✓ delivered, ✓✓ read in accent color)
- **Last seen** timestamp for offline users
- **Auto-scroll** to latest message
- **Optimistic UI updates** — messages appear instantly before server confirmation

### 💾 Message Persistence
- All messages stored in **MongoDB** with indexed queries
- **Paginated chat history** with "Load older messages" button
- Messages sorted chronologically
- Conversation metadata with last message preview

### 📋 Chat Dashboard
- **Sidebar** with recent conversations sorted by activity
- **User search** with debounced input (300ms)
- **Unread message counter** badges
- **Last message preview** in conversation list
- **Real-time sidebar updates** when new messages arrive
- **Responsive layout** — sidebar collapses on mobile

### ⚡ Redis Features
- **Online user tracking** with userId → socketId mapping
- **Redis Pub/Sub** for horizontal scaling across server instances
- **Notification queue** system for offline users
- **Redis-backed rate limiting** on API endpoints
- **Socket session storage** with TTL

### 🎨 UI / UX
- **Dark mode** with purple gradient accent palette
- **Glassmorphism** effects on auth cards
- **Smooth animations** and micro-interactions
- **Loading skeletons** for async content
- **Toast notifications** for system events
- **Mobile responsive** design
- **Custom scrollbars**

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 18 + Vite | UI framework with fast HMR |
| **State** | Zustand | Lightweight state management |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB + Mongoose | Document storage with ODM |
| **Realtime** | Socket.io | Bidirectional WebSocket communication |
| **Cache** | Redis + ioredis | Caching, Pub/Sub, sessions |
| **Auth** | JWT + bcryptjs | Token-based authentication |
| **Styling** | Vanilla CSS | Custom design system with CSS variables |
| **HTTP** | Axios | HTTP client with interceptors |
| **DevOps** | Docker + docker-compose | Containerized deployment |

---

## 📂 Project Structure

```
pingnet/
│
├── client/                          # ⚛️ React Frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx       # Message list + header + input
│   │   │   │   ├── MessageBubble.jsx    # Individual message with status
│   │   │   │   ├── MessageInput.jsx     # Input with typing events
│   │   │   │   └── TypingIndicator.jsx  # Animated typing dots
│   │   │   ├── common/
│   │   │   │   ├── LoadingSkeleton.jsx  # Skeleton loading UI
│   │   │   │   ├── NotificationToast.jsx # Toast notifications
│   │   │   │   ├── OnlineStatus.jsx     # Online/offline dot
│   │   │   │   └── ProtectedRoute.jsx   # Auth guard wrapper
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.jsx          # Conversations + search
│   │   │   └── profile/
│   │   │       └── ProfileCard.jsx      # User profile display
│   │   ├── hooks/
│   │   │   ├── useDebounce.js           # Debounced value hook
│   │   │   └── useSocket.js             # Socket lifecycle hook
│   │   ├── pages/
│   │   │   ├── ChatDashboard.jsx        # Main chat view
│   │   │   ├── LoginPage.jsx            # Login form
│   │   │   ├── ProfilePage.jsx          # User profile
│   │   │   └── RegisterPage.jsx         # Registration form
│   │   ├── services/
│   │   │   ├── api.js                   # Axios instance + interceptors
│   │   │   └── socket.js               # Socket.io client manager
│   │   ├── store/
│   │   │   ├── useAuthStore.js          # Auth state (Zustand)
│   │   │   ├── useChatStore.js          # Chat state (Zustand)
│   │   │   └── useSocketStore.js        # Socket state (Zustand)
│   │   ├── styles/
│   │   │   ├── variables.css            # CSS custom properties
│   │   │   ├── index.css                # Global styles + animations
│   │   │   ├── auth.css                 # Auth page styles
│   │   │   ├── chat.css                 # Chat window styles
│   │   │   ├── sidebar.css              # Sidebar styles
│   │   │   ├── profile.css              # Profile styles
│   │   │   └── components.css           # Shared component styles
│   │   ├── utils/
│   │   │   └── helpers.js               # Formatting utilities
│   │   ├── App.jsx                      # Root + routing
│   │   └── main.jsx                     # Entry point
│   ├── index.html
│   ├── vite.config.js                   # Vite config + proxy
│   ├── package.json
│   └── Dockerfile
│
├── server/                          # 🟢 Node.js Backend (Express)
│   ├── config/
│   │   ├── db.js                        # MongoDB connection
│   │   ├── env.js                       # Environment variables
│   │   └── redis.js                     # Redis client factory
│   ├── controllers/
│   │   ├── authController.js            # Register, login, getMe
│   │   ├── conversationController.js    # Get/create conversations
│   │   ├── messageController.js         # Get/send messages
│   │   └── userController.js            # List/search users
│   ├── middleware/
│   │   ├── asyncHandler.js              # Async error wrapper
│   │   ├── auth.js                      # JWT verification
│   │   ├── errorHandler.js              # Global error handler
│   │   ├── logger.js                    # Request logging
│   │   ├── rateLimiter.js               # Redis rate limiting
│   │   └── validate.js                  # Request validation
│   ├── models/
│   │   ├── Conversation.js              # Conversation schema
│   │   ├── Message.js                   # Message schema
│   │   └── User.js                      # User schema + bcrypt
│   ├── redis/
│   │   ├── client.js                    # Redis client singleton
│   │   ├── onlineUsers.js               # Online user tracking
│   │   ├── pubsub.js                    # Pub/Sub for scaling
│   │   └── sessionStore.js              # Socket session storage
│   ├── routes/
│   │   ├── authRoutes.js                # /api/auth/*
│   │   ├── conversationRoutes.js        # /api/conversations/*
│   │   ├── messageRoutes.js             # /api/messages/*
│   │   └── userRoutes.js                # /api/users/*
│   ├── services/
│   │   ├── authService.js               # Auth business logic
│   │   ├── messageService.js            # Message CRUD + pagination
│   │   └── notificationService.js       # Notification queue
│   ├── sockets/
│   │   ├── events.js                    # Event name constants
│   │   ├── handlers.js                  # Socket event handlers
│   │   └── index.js                     # Socket.io server init
│   ├── utils/
│   │   └── helpers.js                   # Utility functions
│   ├── server.js                        # App entry point
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml               # 🐳 Multi-service orchestration
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:------------|:--------|
| Node.js | 18+ |
| MongoDB | 6+ |
| Redis | 6+ |
| npm | 9+ |
| Docker *(optional)* | 20+ |

---

### Option 1: Docker (Recommended)

The easiest way to run PingNet with all dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/rayaishik/pingnet.git
cd pingnet

# 2. Start all services (MongoDB, Redis, Server, Client)
docker-compose up --build

# 3. Open the app
# → http://localhost (port 80)
```

This starts **4 containers**: MongoDB, Redis, the Express API server, and the React client served via Nginx.

---

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/rayaishik/pingnet.git
cd pingnet

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB and Redis connection URIs

# 3. Start MongoDB and Redis
# If installed locally:
mongod                   # MongoDB
redis-server             # Redis
# Or use Docker for just the databases:
docker-compose up -d mongodb redis

# 4. Install and start the backend
cd server
npm install
npm run dev              # Starts on http://localhost:5000

# 5. Install and start the frontend (new terminal)
cd client
npm install
npm run dev              # Starts on http://localhost:5173

# 6. Open http://localhost:5173 in your browser
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/pingnet

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key_here    # ← Change this in production!
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get authenticated user profile |

**Register Body:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Login Body:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "username": "alice", "email": "alice@example.com", "avatar": "..." },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Users

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/users` | ✅ | List all users (excluding self) |
| `GET` | `/api/users/search?q=alice` | ✅ | Search users by username |

---

### Conversations

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/conversations` | ✅ | Get user's conversations with unread counts |
| `POST` | `/api/conversations` | ✅ | Create or get existing conversation |

**Create Conversation Body:**
```json
{
  "participantId": "60d5ec49f1b2c72b1c8e4d3a"
}
```

---

### Messages

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/messages/:conversationId?page=1&limit=50` | ✅ | Get paginated messages |
| `POST` | `/api/messages` | ✅ | Send a message |

**Send Message Body:**
```json
{
  "conversationId": "60d5ec49f1b2c72b1c8e4d3a",
  "receiverId": "60d5ec49f1b2c72b1c8e4d3b",
  "content": "Hello!",
  "type": "text"
}
```

---

## 🔌 Socket.io Events

### Client → Server

| Event | Payload | Description |
|:------|:--------|:------------|
| `user:online` | — | Notify server that user is online |
| `join:conversation` | `{ conversationId }` | Join a conversation room |
| `send:message` | `{ conversationId, receiverId, content, type, tempId }` | Send a message |
| `typing:start` | `{ conversationId }` | User started typing |
| `typing:stop` | `{ conversationId }` | User stopped typing |
| `message:read` | `{ conversationId }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|:------|:--------|:------------|
| `receive:message` | `{ message, tempId }` | New message received |
| `user:typing` | `{ userId, conversationId, isTyping }` | Typing indicator |
| `user:online` | `{ userId }` | User came online |
| `user:offline` | `{ userId, lastSeen }` | User went offline |
| `message:delivered` | `{ messageId, conversationId }` | Message delivered |
| `message:read` | `{ conversationId, readBy }` | Messages marked as read |
| `unread:update` | `{ conversationId, unreadCount }` | Unread count changed |
| `online:users` | `[userId, ...]` | List of online users |

---

## 🗄 Database Schemas

### User
```javascript
{
  username:     String,     // unique, 3-30 chars
  email:        String,     // unique, validated
  password:     String,     // bcrypt hashed, select: false
  avatar:       String,     // auto-generated URL
  onlineStatus: Boolean,    // true/false
  lastSeen:     Date,       // last disconnect time
  createdAt:    Date,
  updatedAt:    Date
}
```

### Conversation
```javascript
{
  participants: [ObjectId],  // refs to User (2 users)
  lastMessage:  ObjectId,    // ref to Message
  createdAt:    Date,
  updatedAt:    Date
}
```

### Message
```javascript
{
  conversationId: ObjectId,  // ref to Conversation
  senderId:       ObjectId,  // ref to User
  receiverId:     ObjectId,  // ref to User
  content:        String,    // max 5000 chars
  type:           String,    // 'text' | 'image' | 'file' | 'system'
  delivered:      Boolean,   // delivery status
  read:           Boolean,   // read status
  createdAt:      Date,
  updatedAt:      Date
}
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Zustand  │  │  Axios   │  │  Socket.io Client │  │
│  │  Stores   │  │  API     │  │                   │  │
│  └──────────┘  └────┬─────┘  └────────┬──────────┘  │
└──────────────────────┼─────────────────┼─────────────┘
                       │  HTTP           │  WebSocket
┌──────────────────────┼─────────────────┼─────────────┐
│                 Server (Express.js)                   │
│  ┌───────────┐  ┌────┴─────┐  ┌───────┴──────────┐  │
│  │ Middleware │  │  Routes  │  │  Socket.io Server │  │
│  │ Auth/Rate │  │  + Ctrl  │  │  + Handlers       │  │
│  └───────────┘  └────┬─────┘  └───────┬──────────┘  │
│                 ┌────┴────────────────┴───────┐      │
│                 │       Services Layer        │      │
│                 └────┬────────────────┬───────┘      │
└──────────────────────┼────────────────┼──────────────┘
                       │                │
          ┌────────────┴───┐    ┌───────┴────────┐
          │    MongoDB     │    │     Redis       │
          │  Users         │    │  Online Users   │
          │  Conversations │    │  Sessions       │
          │  Messages      │    │  Pub/Sub        │
          └────────────────┘    │  Rate Limits    │
                                │  Notifications  │
                                └────────────────┘
```

---

## 🐳 Docker Setup

The `docker-compose.yml` provisions four services:

| Service | Image | Port | Purpose |
|:--------|:------|:-----|:--------|
| `mongodb` | `mongo:7` | 27017 | Database |
| `redis` | `redis:7-alpine` | 6379 | Cache + Pub/Sub |
| `server` | Custom (Node Alpine) | 5000 | API + Socket.io |
| `client` | Custom (Nginx) | 80 | Static frontend |

```bash
# Start everything
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f server

# Stop everything
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

---

## 🧪 Testing the App

1. **Register** two users (e.g., Alice and Bob)
2. **Login** as Bob
3. **Search** for "alice" in the sidebar
4. **Click** on Alice to create a conversation
5. **Send messages** — they appear instantly with ✓ status
6. **Open another browser** (or incognito), login as Alice
7. **Messages from Bob** appear in real-time
8. **Typing indicators** show when either user types
9. **Online/offline dots** update as users connect/disconnect
10. **Unread badges** appear on the sidebar for unread messages

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using React, Node.js, MongoDB, Redis &amp; Socket.io
</p>
