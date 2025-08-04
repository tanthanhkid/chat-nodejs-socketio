# Hướng dẫn Migration từ CSV sang PostgreSQL

## Tổng quan

Tài liệu này hướng dẫn cách chuyển đổi hệ thống chat từ việc sử dụng file CSV sang PostgreSQL database.

## Yêu cầu hệ thống

- Node.js >= 16
- Docker và Docker Compose
- npm hoặc yarn

## Các bước thực hiện

### 1. Cài đặt dependencies mới

```bash
npm install pg dotenv
```

### 2. Tạo file environment variables

Tạo file `.env` trong thư mục gốc:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp
DB_USER=chatuser
DB_PASSWORD=chatpassword

# Server Configuration
PORT=3000
NODE_ENV=development

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads

# Socket.IO Configuration
CORS_ORIGIN=*
```

### 3. Khởi chạy PostgreSQL Database

```bash
# Chạy PostgreSQL container
npm run db:up

# Kiểm tra logs
npm run db:logs

# Kiểm tra container đang chạy
docker ps
```

### 4. Verify database connection

Khởi chạy ứng dụng để kiểm tra kết nối:

```bash
npm start
```

Bạn sẽ thấy các log:
```
🔍 Testing database connection...
✅ Database connection successful
📅 Database time: [current timestamp]
✅ Database tables verified successfully
🎉 Chat System started successfully!
```

### 5. Migration dữ liệu từ CSV (nếu có)

Nếu bạn có dữ liệu trong file CSV và muốn chuyển sang PostgreSQL, tạo script migration:

```javascript
// scripts/migrate-csv-to-postgresql.js
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { pool } = require('../src/config/database');

async function migrateCsvToPostgres() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Migrate channels
    if (fs.existsSync('./data/channels.csv')) {
      const channelsData = fs.readFileSync('./data/channels.csv');
      const channels = parse(channelsData, { columns: true, skip_empty_lines: true });
      
      for (const channel of channels) {
        await client.query(
          'INSERT INTO channels (channel_id, user_email, created_at) VALUES ($1, $2, $3) ON CONFLICT (channel_id) DO NOTHING',
          [channel.channelId, channel.userEmail, channel.createdAt]
        );
      }
      console.log(`✅ Migrated ${channels.length} channels`);
    }
    
    // Migrate messages
    if (fs.existsSync('./data/messages.csv')) {
      const messagesData = fs.readFileSync('./data/messages.csv');
      const messages = parse(messagesData, { columns: true, skip_empty_lines: true });
      
      for (const message of messages) {
        await client.query(
          'INSERT INTO messages (message_id, channel_id, sender, type, content, timestamp) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (message_id) DO NOTHING',
          [message.messageId, message.channelId, message.sender, message.type, message.content, message.timestamp]
        );
      }
      console.log(`✅ Migrated ${messages.length} messages`);
    }
    
    await client.query('COMMIT');
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateCsvToPostgres();
```

Chạy migration:
```bash
node scripts/migrate-csv-to-postgresql.js
```

## Các thay đổi chính

### 1. Cấu trúc dữ liệu

**Trước (CSV):**
- `channels.csv`: channelId, userEmail, createdAt
- `messages.csv`: messageId, channelId, sender, type, content, timestamp

**Sau (PostgreSQL):**
- `channels` table: id, channel_id, user_email, created_at
- `messages` table: id, message_id, channel_id, sender, type, content, timestamp

### 2. Connection Pool

Sử dụng connection pool để tối ưu hiệu suất:
- Max connections: 20
- Min connections: 2
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

### 3. Error Handling

Tốt hơn với PostgreSQL:
- Transaction support
- Connection retry logic
- Graceful shutdown

## Troubleshooting

### Lỗi kết nối database

```bash
# Kiểm tra container PostgreSQL
docker ps

# Kiểm tra logs PostgreSQL
npm run db:logs

# Restart container
npm run db:down
npm run db:up
```

### Lỗi permission

```bash
# Vào container PostgreSQL
docker exec -it chatapp_postgres psql -U postgres -d chatapp

# Kiểm tra tables
\dt

# Kiểm tra permissions
\dp
```

### Reset database

```bash
# Dừng và xóa container
npm run db:down
docker volume rm database_postgres_data

# Khởi tạo lại
npm run db:up
```

## Quản lý Database

### pgAdmin (Web UI)

Truy cập pgAdmin tại: http://localhost:8080

- Email: admin@chatapp.com
- Password: admin123

### Backup và Restore

```bash
# Backup
docker exec chatapp_postgres pg_dump -U chatuser -d chatapp > backup.sql

# Restore
docker exec -i chatapp_postgres psql -U chatuser -d chatapp < backup.sql
```

### Monitoring

```bash
# Kiểm tra số lượng connections
docker exec chatapp_postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Kiểm tra database size
docker exec chatapp_postgres psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('chatapp'));"
```

## Performance Tips

1. **Indexes**: Database đã được tạo với các index cần thiết
2. **Connection Pool**: Điều chỉnh `max` connections tùy theo traffic
3. **Query Optimization**: Sử dụng EXPLAIN ANALYZE để tối ưu query
4. **Monitoring**: Theo dõi slow queries và connection usage

## Script hữu ích

### Xóa dữ liệu cũ

```sql
-- Xóa messages cũ hơn 90 ngày
DELETE FROM messages WHERE timestamp < NOW() - INTERVAL '90 days';

-- Xóa channels không có messages
DELETE FROM channels WHERE channel_id NOT IN (SELECT DISTINCT channel_id FROM messages);
```

### Thống kê

```sql
-- Tổng số messages theo ngày
SELECT DATE(timestamp) as date, COUNT(*) as message_count 
FROM messages 
GROUP BY DATE(timestamp) 
ORDER BY date DESC;

-- Top active channels
SELECT channel_id, COUNT(*) as message_count 
FROM messages 
GROUP BY channel_id 
ORDER BY message_count DESC 
LIMIT 10;
```