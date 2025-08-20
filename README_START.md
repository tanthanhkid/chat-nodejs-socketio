# 🚀 Hướng dẫn Start Dự án Chat Node.js Socket.IO

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- **Node.js** (phiên bản 14 trở lên)
- **Docker** và **Docker Compose**
- **Git**

## 🎯 Cách Start Dự án

### Phương pháp 1: Sử dụng Script Tự động (Khuyến nghị)

#### Trên macOS/Linux:
```bash
# Cấp quyền thực thi cho script
chmod +x start.sh

# Chạy script start
./start.sh
```

#### Trên Windows:
```cmd
# Chạy script start
start.bat
```

### Phương pháp 2: Start Thủ công

#### Bước 1: Tạo file .env
Tạo file `.env` trong thư mục gốc với nội dung:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp
DB_USER=chatuser
DB_PASSWORD=chatpassword

# Server Configuration
PORT=3000

# Optional: Environment
NODE_ENV=development
```

#### Bước 2: Khởi động Database
```bash
# Di chuyển vào thư mục database
cd database

# Khởi động PostgreSQL với Docker
docker-compose up -d

# Kiểm tra container đang chạy
docker-compose ps

# Quay lại thư mục gốc
cd ..
```

#### Bước 3: Cài đặt Dependencies
```bash
# Cài đặt các package cần thiết
npm install
```

#### Bước 4: Tạo thư mục uploads
```bash
# Tạo thư mục để lưu file upload
mkdir -p public/uploads
```

#### Bước 5: Khởi động Server
```bash
# Chạy server
npm start
```

## 🔍 Kiểm tra Dự án Đã Hoạt Động

Sau khi start thành công, bạn có thể truy cập:

- **Trang chủ**: http://localhost:3000
- **Trang Admin**: http://localhost:3000/admin
- **Example Widget**: http://localhost:3000/example
- **pgAdmin** (quản lý database): http://localhost:8080

### Thông tin đăng nhập pgAdmin:
- **Email**: admin@chatapp.com
- **Password**: admin123

## 🛠️ Các Lệnh Hữu Ích

### Quản lý Database
```bash
# Khởi động database
npm run db:up

# Dừng database
npm run db:down

# Xem logs database
npm run db:logs
```

### Development
```bash
# Chạy với nodemon (tự động restart khi có thay đổi)
npm run dev
```

## 🐛 Xử lý Lỗi Thường Gặp

### 1. Lỗi "Docker không đang chạy"
```bash
# Khởi động Docker Desktop
# Hoặc trên Linux:
sudo systemctl start docker
```

### 2. Lỗi "Port 5432 đã được sử dụng"
```bash
# Kiểm tra process đang sử dụng port
lsof -i :5432

# Dừng PostgreSQL local nếu có
sudo service postgresql stop
```

### 3. Lỗi "Permission denied" khi chạy script
```bash
# Cấp quyền thực thi
chmod +x start.sh
```

### 4. Lỗi kết nối database
```bash
# Kiểm tra container đang chạy
docker ps

# Restart database
cd database
docker-compose down
docker-compose up -d
```

## 📁 Cấu trúc Dự án

```
chat-nodejs-socketio/
├── database/                 # Cấu hình PostgreSQL
│   ├── docker-compose.yml
│   └── init.sql
├── public/                   # Tài nguyên tĩnh
│   ├── css/
│   ├── js/
│   └── uploads/             # Thư mục lưu file upload
├── src/                     # Mã nguồn server
│   ├── config/
│   ├── services/
│   └── server.js
├── views/                   # Template Handlebars
├── package.json
├── start.sh                 # Script start cho macOS/Linux
├── start.bat               # Script start cho Windows
└── README_START.md         # File này
```

## 🎉 Chúc mừng!

Dự án đã được khởi động thành công! Bạn có thể:

1. **Truy cập trang Admin** để quản lý các cuộc trò chuyện
2. **Nhúng widget chat** vào bất kỳ trang web nào
3. **Test tính năng chat real-time** giữa User và Admin
4. **Upload và gửi hình ảnh** trong cuộc trò chuyện

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
- Logs của server trong terminal
- Logs của database: `npm run db:logs`
- Đảm bảo tất cả ports cần thiết không bị chiếm dụng
