#!/bin/bash

echo "🚀 Bắt đầu khởi động dự án Chat Node.js Socket.IO..."

# Kiểm tra xem Docker có đang chạy không
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker không đang chạy. Vui lòng khởi động Docker trước."
    exit 1
fi

# Tạo file .env nếu chưa tồn tại
if [ ! -f .env ]; then
    echo "📝 Tạo file .env..."
    cat > .env << EOF
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
EOF
    echo "✅ Đã tạo file .env"
fi

# Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
if [ ! -d "public/uploads" ]; then
    echo "📁 Tạo thư mục uploads..."
    mkdir -p public/uploads
    echo "✅ Đã tạo thư mục uploads"
fi

# Khởi động PostgreSQL database
echo "🐘 Khởi động PostgreSQL database..."
cd database
docker compose up -d

# Đợi database khởi động
echo "⏳ Đợi database khởi động..."
sleep 10

# Kiểm tra database đã sẵn sàng chưa
echo "🔍 Kiểm tra kết nối database..."
until docker compose exec -T postgres pg_isready -U postgres; do
    echo "⏳ Đợi database sẵn sàng..."
    sleep 2
done

cd ..

# Cài đặt dependencies nếu chưa có
if [ ! -d "node_modules" ]; then
    echo "📦 Cài đặt dependencies..."
    npm install
    echo "✅ Đã cài đặt dependencies"
fi

# Khởi động server
echo "🌐 Khởi động server..."
npm start
