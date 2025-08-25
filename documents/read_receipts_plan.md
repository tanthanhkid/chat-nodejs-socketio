# Read Receipts Feature Plan (Updated - Based on Current Code)

## Project Overview
- **Backend:** Express server with Socket.IO for real-time communication (`src/server.js`).
- **Database:** PostgreSQL with `channels` and `messages` tables (`database/init.sql`). Database helpers reside in `src/services/dbService.js`.
- **Real-time:** Socket namespaces for users and admins handle events such as `user:join` and `chat:message` (`src/services/socketService.js`).
- **Frontend:**
  - **Admin dashboard:** Handlebars templates (`views/admin.hbs`) with JavaScript logic in `public/js/admin.js` and styles in `public/css/admin.css`.
  - **User chat widget:** Embedded widget scripts in `public/js/chat-widget.js` with styles in `public/css/widget.css`.

## Current Status Analysis

### ✅ Đã có sẵn:
1. **Database Schema:** 
   - Bảng `messages` đã có `admin_read_at` và `user_read_at` columns
   - Index đã được tạo cho performance

2. **Database Functions:**
   - `markMessagesRead(channelId, reader, messageIds)` - đánh dấu tin nhắn đã đọc
   - `getUnreadCountForAdmin(channelId)` - đếm tin nhắn chưa đọc của admin
   - `getMessages()` đã trả về `adminReadAt` và `userReadAt`

3. **Socket Events:**
   - `chat:read` event đã có cho cả user và admin
   - Admin namespace đã setup đầy đủ
   - Unread count tracking đã có

4. **Admin Dashboard:**
   - Unread count display đã có trong `admin.hbs`
   - `admin.js` đã handle `chat:read` events
   - Auto-mark read khi admin nhận tin nhắn mới

### ❌ Cần thay đổi theo plan mới:

## Read Receipts Logic (Updated)
**Cơ chế mới:** Tin nhắn được đánh dấu là "read" khi:
- **User:** Mở khung chat widget (không phải chỉ khi nhận tin nhắn)
- **Admin:** Click mở đoạn hội thoại với user cụ thể (không phải chỉ khi nhận tin nhắn)

## Implementation Plan (Changes Needed)

### 1. Database Functions (Cần thêm)
- **Thêm function mới:**
  ```javascript
  // Thêm vào dbService.js
  async function markAllMessagesAsReadByUser(channelId, userId) {
    // Đánh dấu tất cả tin nhắn của admin là read
  }
  
  async function markAllMessagesAsReadByAdmin(channelId, adminId) {
    // Đánh dấu tất cả tin nhắn của user là read
  }
  
  async function getUnreadCountForUser(channelId, userId) {
    // Đếm tin nhắn chưa đọc của user
  }
  ```

### 2. Socket Events (Cần thay đổi)
- **Thay đổi logic hiện tại:**
  - ❌ Bỏ auto-mark read khi nhận tin nhắn mới trong `admin.js` line 58
  - ✅ Thêm events mới:
    - `chat:user_opened_widget` - khi user mở chat widget
    - `chat:admin_opened_conversation` - khi admin click mở conversation
    - `chat:read_status_updated` - broadcast khi read status thay đổi

### 3. User Chat Widget (Cần thêm)
- **Thêm vào chat-widget.js:**
  ```javascript
  // Khi user click mở widget
  $('#chat-bubble').on('click', function() {
    if (socket && userEmail) {
      socket.emit('chat:user_opened_widget', { channelId: userEmail });
    }
  });
  
  // Handle read status updates
  socket.on('chat:read_status_updated', function(data) {
    updateMessageReadStatus(data);
  });
  ```

### 4. Admin Dashboard (Cần thay đổi)
- **Thay đổi trong admin.js:**
  ```javascript
  // Thay vì auto-mark read khi nhận tin nhắn (line 58)
  // Chỉ mark read khi admin click mở conversation
  function selectChannel(channelId, userEmail) {
    // ... existing code ...
    
    // Mark all user messages as read when opening conversation
    socket.emit('chat:admin_opened_conversation', { channelId });
  }
  ```

### 5. UI/UX Enhancements (Cần thêm)
- **Read Status Display:**
  - Chỉ hiển thị "Đã xem" text cho tin nhắn đã được đọc
  - Không cần checkmarks (✓, ✓✓)
- **CSS Updates:**
  - Style cho "Đã xem" text
  - Màu xám nhạt cho text "Đã xem"

### 6. Specific Code Changes

#### A. socketService.js (Thay đổi)
```javascript
// Thêm event handlers mới
socket.on('chat:user_opened_widget', async ({ channelId }) => {
  try {
    await markAllMessagesAsReadByUser(channelId, channelId);
    adminNamespace.emit('chat:read_status_updated', {
      channelId,
      reader: 'user',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error marking messages read by user:', error);
  }
});

socket.on('chat:admin_opened_conversation', async ({ channelId }) => {
  try {
    await markAllMessagesAsReadByAdmin(channelId, 'admin');
    io.to(channelId).emit('chat:read_status_updated', {
      channelId,
      reader: 'admin',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error marking messages read by admin:', error);
  }
});
```

#### B. admin.js (Thay đổi)
```javascript
// Bỏ dòng này (line 58):
// socket.emit('chat:read', { channelId: currentChannelId, messageIds: [message.messageId] });

// Thêm vào function selectChannel:
function selectChannel(channelId, userEmail) {
  // ... existing code ...
  
  // Mark all messages as read when opening conversation
  socket.emit('chat:admin_opened_conversation', { channelId });
}
```

#### C. chat-widget.js (Thêm)
```javascript
// Thêm vào setupEventListeners():
$('#chat-bubble').on('click', function() {
  if (socket && userEmail) {
    socket.emit('chat:user_opened_widget', { channelId: userEmail });
  }
});

// Thêm event listener:
socket.on('chat:read_status_updated', function(data) {
  if (data.reader === 'admin') {
    updateMessageReadStatus(data);
  }
});
```

### 7. Testing Scenarios
- User mở widget → tất cả tin nhắn admin chuyển thành "read"
- Admin mở conversation → tất cả tin nhắn user chuyển thành "read"
- Real-time updates khi cả 2 bên online
- Offline behavior khi một bên không online
- Multiple admin handling

## Benefits of New Approach
1. **Chính xác hơn:** Chỉ đánh dấu read khi thực sự xem tin nhắn
2. **UX tốt hơn:** User/admin biết chính xác khi nào tin nhắn được đọc
3. **Performance:** Ít events hơn, chỉ emit khi thực sự cần thiết
4. **Scalable:** Dễ mở rộng cho các tính năng khác như typing indicators

## Migration Notes
- Database schema không cần thay đổi (đã có sẵn)
- Cần backup data trước khi deploy
- Test kỹ các scenarios offline/online
- Monitor performance sau khi deploy
