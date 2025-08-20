@echo off
echo 🚀 Bắt đầu khởi động dự án Chat Node.js Socket.IO...

REM Kiểm tra xem Docker có đang chạy không
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker không đang chạy. Vui lòng khởi động Docker trước.
    pause
    exit /b 1
)

REM Tạo file .env nếu chưa tồn tại
if not exist .env (
    echo 📝 Tạo file .env...
    (
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_NAME=chatapp
        echo DB_USER=chatuser
        echo DB_PASSWORD=chatpassword
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo.
        echo # Optional: Environment
        echo NODE_ENV=development
    ) > .env
    echo ✅ Đã tạo file .env
)

REM Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
if not exist "public\uploads" (
    echo 📁 Tạo thư mục uploads...
    mkdir "public\uploads"
    echo ✅ Đã tạo thư mục uploads
)

REM Khởi động PostgreSQL database
echo 🐘 Khởi động PostgreSQL database...
cd database
docker-compose up -d

REM Đợi database khởi động
echo ⏳ Đợi database khởi động...
timeout /t 10 /nobreak >nul

REM Kiểm tra database đã sẵn sàng chưa
echo 🔍 Kiểm tra kết nối database...
:check_db
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo ⏳ Đợi database sẵn sàng...
    timeout /t 2 /nobreak >nul
    goto check_db
)

cd ..

REM Cài đặt dependencies nếu chưa có
if not exist "node_modules" (
    echo 📦 Cài đặt dependencies...
    npm install
    echo ✅ Đã cài đặt dependencies
)

REM Khởi động server
echo 🌐 Khởi động server...
npm start
