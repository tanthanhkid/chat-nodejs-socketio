# Tài liệu Kỹ thuật: Nền tảng Chat User-Admin
**Phiên bản: 2.0**  
**Ngày cập nhật: 04/08/2025**

## 1. Tổng quan dự án (Project Overview)

### 1.1. Mục tiêu
Xây dựng một hệ thống chat thời gian thực cho phép nhiều người dùng (User) trên một trang web bất kỳ có thể trò chuyện trực tiếp với một quản trị viên duy nhất (Admin). Hệ thống cần hỗ trợ gửi tin nhắn văn bản và hình ảnh với cơ sở dữ liệu PostgreSQL.

### 1.2. Thành phần chính
- **Trang Admin**: Một giao diện web cho Admin để xem danh sách các cuộc trò chuyện, đọc và trả lời tin nhắn (văn bản và hình ảnh) của từng User.
- **Widget Chat**: Một thư viện JavaScript (JS) có thể nhúng vào bất kỳ trang web nào. Widget này hiển thị một bong bóng chat, cho phép User bắt đầu cuộc trò chuyện.
- **PostgreSQL Database**: Cơ sở dữ liệu quan hệ để lưu trữ thông tin channels và messages.

### 1.3. Yêu cầu chức năng
- **Chat Real-time**: Tin nhắn được gửi và nhận ngay lập tức.
- **Định danh User**:
  - User có thể bắt đầu chat bằng cách nhập email.
  - Hệ thống có thể tự động nhận diện email nếu được truyền vào khi khởi tạo widget.
- **Gửi hình ảnh**:
  - User và Admin có thể gửi hình ảnh cho nhau.
  - Giới hạn kích thước ảnh tải lên là 5MB.
  - Ảnh được nén ở phía client (trình duyệt) trước khi tải lên server để giảm dung lượng.
- **Lưu trữ**: Toàn bộ lịch sử chat (kênh và tin nhắn) được lưu trữ trong PostgreSQL database.

## 2. Kiến trúc tổng thể (Project Architecture)

Hệ thống được xây dựng theo mô hình Client-Server với cơ sở dữ liệu PostgreSQL.

**Server (Node.js)**: Một máy chủ duy nhất đảm nhiệm tất cả các vai trò:
- Phục vụ trang web cho Admin (/admin).
- Xử lý các kết nối real-time qua Socket.IO.
- Xử lý upload và lưu trữ file ảnh.
- Kết nối và thao tác với PostgreSQL database thông qua connection pool.
- Phục vụ file thư viện chat-widget.js và các tài nguyên tĩnh (CSS, ảnh đã upload).

**PostgreSQL Database**: 
- Chạy trong Docker container.
- Sử dụng connection pool để tối ưu hiệu suất.
- Lưu trữ thông tin channels và messages.

**Client**:
- **Admin's Browser**: Trình duyệt của Admin truy cập vào trang /admin.
- **User's Browser**: Bất kỳ trang web nào nhúng widget chat.

## 3. Kiến trúc ứng dụng (Application Architecture)

### 3.1. Cấu trúc thư mục dự án
```
/chat-system
|
|-- /data                  # Không còn sử dụng CSV files
|
|-- /database              # Cấu hình database
|   |-- init.sql
|   `-- docker-compose.yml
|
|-- /public                # Tài nguyên tĩnh, truy cập công khai
|   |-- /css
|   |   |-- admin.css
|   |   `-- widget.css
|   |-- /js
|   |   |-- admin.js
|   |   `-- chat-widget.js   # File thư viện nhúng
|   `-- /uploads           # Thư mục lưu trữ ảnh tải lên
|
|-- /src                   # Mã nguồn chính của server
|   |-- /config
|   |   `-- database.js    # Cấu hình kết nối PostgreSQL
|   |-- /services
|   |   |-- dbService.js   # Module xử lý database operations
|   |   `-- socketService.js   # Module xử lý logic Socket.IO
|   `-- server.js          # File khởi tạo server
|
|-- /views                 # Chứa các file template Handlebars
|   |-- layouts
|   |   `-- main.hbs
|   `-- admin.hbs
|
|-- package.json
`-- .env                   # Environment variables
```

## 4. Lựa chọn công nghệ (Technology Stack)

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Database Connection**: node-postgres (pg) với connection pool
- **Real-time**: Socket.IO
- **View Engine**: express-handlebars
- **Xử lý Upload**: multer
- **Frontend (Widget)**: HTML, CSS, jQuery
- **Nén ảnh (Client)**: browser-image-compression
- **Container**: Docker & Docker Compose

## 5. Thiết kế Cơ sở Dữ liệu (Database Design)

### 5.1. Bảng `channels`
Lưu thông tin về các kênh chat (mỗi user là một kênh).

| Cột | Kiểu dữ liệu | Mô tả |
|-----|-------------|-------|
| id | SERIAL PRIMARY KEY | ID tự tăng |
| channel_id | VARCHAR(255) UNIQUE | ID kênh (sử dụng email của user) |
| user_email | VARCHAR(255) NOT NULL | Email của user |
| created_at | TIMESTAMP DEFAULT NOW() | Thời gian tạo |

### 5.2. Bảng `messages`
Lưu toàn bộ tin nhắn của tất cả các kênh.

| Cột | Kiểu dữ liệu | Mô tả |
|-----|-------------|-------|
| id | SERIAL PRIMARY KEY | ID tự tăng |
| message_id | UUID UNIQUE | ID tin nhắn (UUID) |
| channel_id | VARCHAR(255) | ID kênh (foreign key) |
| sender | VARCHAR(10) CHECK (sender IN ('user', 'admin')) | Người gửi |
| type | VARCHAR(10) CHECK (type IN ('text', 'image')) | Loại tin nhắn |
| content | TEXT | Nội dung tin nhắn |
| timestamp | TIMESTAMP DEFAULT NOW() | Thời gian gửi |

**Giải thích**:
- `type`: Xác định loại tin nhắn.
- `content`:
  - Nếu `type` là 'text', `content` chứa nội dung tin nhắn.
  - Nếu `type` là 'image', `content` chứa đường dẫn (URL) tới file ảnh trên server (ví dụ: /uploads/1677826800.jpg).

## 6. Connection Pool Configuration

Hệ thống sử dụng connection pool để tối ưu hiệu suất kết nối database:

```javascript
// Cấu hình connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,          // Số connection tối đa
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 7. Luồng xử lý các tính năng chính

### 7.1. Luồng Gửi Hình ảnh
Đây là luồng xử lý phức tạp nhất, kết hợp cả HTTP request và Socket.IO.

1. **Client**: User/Admin chọn một file ảnh.
2. **Client (JS)**: Kiểm tra kích thước file (phải < 5MB).
3. **Client (JS)**: Sử dụng thư viện browser-image-compression để nén ảnh.
4. **Client (JS)**: Gửi file ảnh đã nén bằng fetch tới endpoint POST /upload của server.
5. **Server**: Middleware multer nhận và lưu file ảnh vào thư mục /public/uploads.
6. **Server**: Endpoint /upload trả về JSON chứa URL của ảnh, ví dụ: `{ "url": "/uploads/1677826800.jpg" }`.
7. **Client (JS)**: Nhận được URL.
8. **Client (JS)**: Gửi một tin nhắn qua Socket.IO với type: 'image' và content: <URL nhận được>.
9. **Server (Socket.IO)**: Nhận tin nhắn, lưu vào PostgreSQL database, và phát tin nhắn này tới người nhận.
10. **Client (Người nhận)**: Nhận được tin nhắn, kiểm tra type là 'image', và render thẻ `<img>` ra giao diện chat.

## 8. Environment Variables

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp
DB_USER=chatuser
DB_PASSWORD=chatpassword
PORT=3000
```

## 9. Setup và Deployment

### 9.1. Khởi chạy PostgreSQL với Docker
```bash
# Chạy PostgreSQL container
docker-compose up -d

# Kiểm tra container
docker-compose ps
```

### 9.2. Khởi chạy ứng dụng
```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

## 10. Cải tiến so với phiên bản CSV

1. **Hiệu suất**: PostgreSQL với connection pool cung cấp hiệu suất tốt hơn nhiều so với việc đọc/ghi file CSV.
2. **Tính nhất quán**: ACID properties của PostgreSQL đảm bảo tính nhất quán dữ liệu.
3. **Khả năng mở rộng**: Dễ dàng thêm indexes, constraints và tối ưu query.
4. **Backup & Recovery**: PostgreSQL cung cấp các công cụ backup và recovery mạnh mẽ.
5. **Concurrent Access**: Xử lý đồng thời tốt hơn nhiều so với file CSV.
6. **Data Integrity**: Foreign keys và constraints đảm bảo tính toàn vẹn dữ liệu.

## 11. Code mẫu (Sample Code)

### 11.1. Database Configuration
```javascript
// src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

### 11.2. Database Service
```javascript
// src/services/dbService.js
const pool = require('../config/database');

async function getAllChannels() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM channels ORDER BY created_at DESC');
    return result.rows;
  } finally {
    client.release();
  }
}

async function getOrCreateChannel(email) {
  const client = await pool.connect();
  try {
    // Kiểm tra channel đã tồn tại
    let result = await client.query('SELECT * FROM channels WHERE user_email = $1', [email]);
    
    if (result.rows.length === 0) {
      // Tạo channel mới
      result = await client.query(
        'INSERT INTO channels (channel_id, user_email) VALUES ($1, $2) RETURNING *',
        [email, email]
      );
    }
    
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getMessages(channelId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM messages WHERE channel_id = $1 ORDER BY timestamp ASC',
      [channelId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

async function addMessage(messageData) {
  const client = await pool.connect();
  try {
    const { channelId, sender, type, content, timestamp } = messageData;
    const result = await client.query(
      'INSERT INTO messages (message_id, channel_id, sender, type, content, timestamp) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *',
      [channelId, sender, type, content, timestamp || new Date()]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  getAllChannels,
  getOrCreateChannel,
  getMessages,
  addMessage
};
```

Hệ thống đã được thiết kế lại hoàn toàn để sử dụng PostgreSQL với connection pool, đảm bảo hiệu suất cao và khả năng mở rộng tốt.