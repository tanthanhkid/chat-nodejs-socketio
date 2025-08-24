// src/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const exphbs = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const { testConnection } = require('./config/database');
const { initializeDatabase, getAllChannelsWithLastMessage } = require('./services/dbService');
const initializeSocket = require('./services/socketService');

// Khởi tạo
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép tất cả các domain kết nối
        methods: ["GET", "POST"]
    }
});

// Cấu hình view engine
app.engine('hbs', exphbs.engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        formatDate: function(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            // Server is already in GMT+7, just format properly
            return date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        truncate: function(str, len) {
            if (!str) return '';
            if (str.length > len) {
                return str.substring(0, len) + '...';
            }
            return str;
        },
        eq: function(a, b) {
            return a === b;
        },
        gt: function(a, b) {
            return a > b;
        },
        substring: function(str, start, end) {
            if (!str) return '';
            return str.substring(start, end);
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Cấu hình Multer để lưu file
const diskStorage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ hỗ trợ upload file ảnh (JPEG, JPG, PNG, GIF, WEBP)!'));
    }
}).single('image');

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Chat System Running!</h1>
        <p><a href="/admin">Trang Admin</a></p>
        <p><a href="/broadcast">Broadcast Messages</a></p>
        <p><a href="/example">Example Widget</a></p>
    `);
});

app.get('/admin', async (req, res) => {
    try {
        const channels = await getAllChannelsWithLastMessage();
        res.render('admin', { 
            layout: 'main', 
            channels,
            title: 'Admin Chat Dashboard',
            currentPage: 'dashboard'
        });
    } catch (error) {
        console.error('Error rendering admin page:', error);
        res.status(500).send('Error loading admin page');
    }
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                error: err.message || 'Upload failed' 
            });
        }
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Không có file nào được chọn!' 
            });
        }
        
        console.log('File uploaded:', req.file.filename);
        res.status(200).json({ 
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename
        });
    });
});

// Broadcast routes
const BroadcastService = require('./services/broadcastService');

app.get('/broadcast', async (req, res) => {
    try {
        res.render('broadcast', { 
            layout: 'main', 
            title: 'Broadcast Messages',
            currentPage: 'broadcast'
        });
    } catch (error) {
        console.error('Error rendering broadcast page:', error);
        res.status(500).send('Error loading broadcast page');
    }
});

// API endpoints
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await BroadcastService.getDepartments();
        res.json(departments);
    } catch (error) {
        console.error('Error getting departments:', error);
        res.status(500).json({ error: 'Failed to get departments' });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const departmentId = req.query.departmentId ? parseInt(req.query.departmentId) : null;
        const employees = await BroadcastService.getEmployees(departmentId);
        res.json(employees);
    } catch (error) {
        console.error('Error getting employees:', error);
        res.status(500).json({ error: 'Failed to get employees' });
    }
});

app.post('/api/broadcast/send', async (req, res) => {
    try {
        const { content, type, targetType, targetDepartmentId } = req.body;
        
        // Validate input
        if (!content || !type || !targetType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (targetType === 'department' && !targetDepartmentId) {
            return res.status(400).json({ error: 'Department ID required for department target' });
        }
        
        // Send broadcast
        const result = await BroadcastService.sendBroadcastMessage({
            content,
            type,
            targetType,
            targetDepartmentId
        });
        
        res.json(result);
    } catch (error) {
        console.error('Error sending broadcast:', error);
        res.status(500).json({ error: 'Failed to send broadcast' });
    }
});

app.get('/api/broadcast/history', async (req, res) => {
    try {
        const broadcasts = await BroadcastService.getBroadcastHistory();
        res.json(broadcasts);
    } catch (error) {
        console.error('Error getting broadcast history:', error);
        res.status(500).json({ error: 'Failed to get broadcast history' });
    }
});

// Example page để test widget
app.get('/example', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Website with Chat Widget</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .content { max-width: 800px; margin: 0 auto; }
        h1 { color: #333; }
        p { line-height: 1.6; margin-bottom: 20px; }
        .feature { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="content">
        <h1>Chào mừng đến với website demo!</h1>
        <p>Đây là một trang web mẫu để test chat widget. Widget chat sẽ xuất hiện ở góc dưới bên phải.</p>
        
        <div class="feature">
            <h3>Tính năng chat widget:</h3>
            <ul>
                <li>Chat real-time với admin</li>
                <li>Gửi tin nhắn text và hình ảnh</li>
                <li>Tự động nhận diện email hoặc nhập email để bắt đầu</li>
                <li>Lưu trữ lịch sử chat</li>
            </ul>
        </div>
        
        <p>Hãy click vào biểu tượng chat ở góc dưới để bắt đầu trò chuyện!</p>
    </div>

    <!-- 1. Nhúng thư viện Socket.IO client -->
    <script src="/socket.io/socket.io.js"></script>
    <!-- 2. Nhúng thư viện nén ảnh -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js"></script>
    <!-- 3. Nhúng jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- 4. Nhúng timezone utilities -->
    <script src="/js/timezone-utils.js"></script>
    <!-- 5. Nhúng thư viện chat widget -->
    <script src="/js/chat-widget.js"></script>
    <script>
        // Khởi tạo widget
        MyChatWidget.init();
        
        // Hoặc khởi tạo với email của user đã đăng nhập
        // MyChatWidget.init({ email: 'john.doe@example.com' });
    </script>
</body>
</html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Khởi tạo Database và Socket
async function startServer() {
    try {
        // Kiểm tra kết nối database
        console.log('🔍 Testing database connection...');
        const isConnected = await testConnection();
        
        if (!isConnected) {
            console.error('❌ Cannot connect to database. Please check your PostgreSQL connection.');
            console.log('💡 Make sure to run: npm run db:up');
            process.exit(1);
        }
        
        // Khởi tạo database
        await initializeDatabase();
        
        // Khởi tạo Socket.IO
        initializeSocket(io);
        
        // Chạy server
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log('🎉 Chat System started successfully!');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
            console.log(`🧪 Widget Example: http://localhost:${PORT}/example`);
            console.log('📱 Ready for chat connections!');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer();