-- Tạo database và user cho ứng dụng chat
CREATE DATABASE chatapp;
CREATE USER chatuser WITH ENCRYPTED PASSWORD 'chatpassword';
GRANT ALL PRIVILEGES ON DATABASE chatapp TO chatuser;

-- Kết nối vào database chatapp
\c chatapp;

-- Cấp quyền cho user chatuser
GRANT ALL ON SCHEMA public TO chatuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chatuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO chatuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chatuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chatuser;

-- Tạo bảng channels
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    message_id UUID UNIQUE DEFAULT gen_random_uuid(),
    channel_id VARCHAR(255) NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('user', 'admin')) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('text', 'image')) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    admin_read_at TIMESTAMP,
    user_read_at TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE
);

-- Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_channels_user_email ON channels(user_email);

-- Thêm dữ liệu mẫu (optional)
-- Chú ý: Dữ liệu mẫu sẽ được tạo bởi ứng dụng khi cần thiết