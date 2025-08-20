# Read Receipts Feature Plan

## Project Overview
- **Backend:** Express server with Socket.IO for real-time communication (`src/server.js`).
- **Database:** PostgreSQL with `channels` and `messages` tables (`database/init.sql`). Database helpers reside in `src/services/dbService.js`.
- **Real-time:** Socket namespaces for users and admins handle events such as `user:join` and `chat:message` (`src/services/socketService.js`).
- **Frontend:**
  - **Admin dashboard:** Handlebars templates (`views/admin.hbs`) with JavaScript logic in `public/js/admin.js` and styles in `public/css/admin.css`.
  - **User chat widget:** Embedded widget scripts in `public/js/chat-widget.js` with styles in `public/css/widget.css`.

## Adding Read Receipts
To show whether each side has read the other's messages, update the following areas:

### 1. Database (`database/init.sql`, `src/services/dbService.js`)
- Add columns to `messages` for read status, e.g., `admin_read_at` and `user_read_at`.
- Update `getMessages` and `addMessage` to include these fields.
- Implement helper like `markMessagesRead(channelId, reader)` to update read timestamps.

### 2. Socket Events (`src/services/socketService.js`)
- Add events such as `chat:read` from both user and admin clients.
- When a client reports messages as read, call the new DB helper and broadcast a `chat:read` event to the opposite side.

### 3. User Chat Widget (`public/js/chat-widget.js`, `public/css/widget.css`)
- After displaying admin messages, emit `chat:read` with their IDs.
- Listen for `chat:read` events from the server to update UI (e.g., checkmarks or “Đã xem”).
- Update styles to show read indicators.

### 4. Admin Dashboard (`public/js/admin.js`, `views/admin.hbs`, `public/css/admin.css`)
- When viewing a channel, emit `chat:read` for user messages in that channel.
- Handle incoming `chat:read` events to mark admin messages as read.
- Update Handlebars template and CSS to display read markers beside each message.

### 5. Optional Server Enhancements
- Expose an API or admin panel section to review read statistics if needed.

These changes integrate a bi-directional read receipt system where both parties can see when their messages have been viewed.
