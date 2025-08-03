Tài liệu Kỹ thuật: Nền tảng Chat User-AdminPhiên bản: 1.1Ngày cập nhật: 04/08/20251. Tổng quan dự án (Project Overview)1.1. Mục tiêuXây dựng một hệ thống chat thời gian thực cho phép nhiều người dùng (User) trên một trang web bất kỳ có thể trò chuyện trực tiếp với một quản trị viên duy nhất (Admin). Hệ thống cần hỗ trợ gửi tin nhắn văn bản và hình ảnh.1.2. Thành phần chínhTrang Admin: Một giao diện web cho Admin để xem danh sách các cuộc trò chuyện, đọc và trả lời tin nhắn (văn bản và hình ảnh) của từng User.Widget Chat: Một thư viện JavaScript (JS) có thể nhúng vào bất kỳ trang web nào. Widget này hiển thị một bong bóng chat, cho phép User bắt đầu cuộc trò chuyện.1.3. Yêu cầu chức năngChat Real-time: Tin nhắn được gửi và nhận ngay lập tức.Định danh User:User có thể bắt đầu chat bằng cách nhập email.Hệ thống có thể tự động nhận diện email nếu được truyền vào khi khởi tạo widget.Gửi hình ảnh:User và Admin có thể gửi hình ảnh cho nhau.Giới hạn kích thước ảnh tải lên là 5MB.Ảnh được nén ở phía client (trình duyệt) trước khi tải lên server để giảm dung lượng.Lưu trữ: Toàn bộ lịch sử chat (kênh và tin nhắn) được lưu trữ trong file CSV trên server.2. Kiến trúc tổng thể (Project Architect)Hệ thống được xây dựng theo mô hình Client-Server đơn giản (Monolith).Server (Node.js): Một máy chủ duy nhất đảm nhiệm tất cả các vai trò:Phục vụ trang web cho Admin (/admin).Xử lý các kết nối real-time qua Socket.IO.Xử lý upload và lưu trữ file ảnh.Đọc/Ghi dữ liệu cuộc trò chuyện vào file CSV.Phục vụ file thư viện chat-widget.js và các tài nguyên tĩnh (CSS, ảnh đã upload).Client:Admin's Browser: Trình duyệt của Admin truy cập vào trang /admin.User's Browser: Bất kỳ trang web nào nhúng widget chat.3. Kiến trúc ứng dụng (Application Architect)3.1. Cấu trúc thư mục dự án/chat-system
|
|-- /data                # Chứa các file CSV
|   |-- channels.csv
|   `-- messages.csv
|
|-- /public              # Tài nguyên tĩnh, truy cập công khai
|   |-- /css
|   |   |-- admin.css
|   |   `-- widget.css
|   |-- /js
|   |   |-- admin.js
|   |   `-- chat-widget.js   # File thư viện nhúng
|   `-- /uploads         # Thư mục lưu trữ ảnh tải lên
|
|-- /src                 # Mã nguồn chính của server
|   |-- services
|   |   |-- storageService.js  # Module xử lý đọc/ghi file CSV
|   |   `-- socketService.js   # Module xử lý logic Socket.IO
|   `-- server.js        # File khởi tạo server
|
|-- /views               # Chứa các file template Handlebars
|   |-- layouts
|   |   `-- main.hbs
|   `-- admin.hbs
|
`-- package.json
4. Lựa chọn công nghệ (Technology Stack)Backend: Node.js, Express.jsReal-time: Socket.IOView Engine: express-handlebarsXử lý Upload: multerXử lý CSV: csv-parser (đọc), csv-writer (ghi)Frontend (Widget): HTML, CSS, jQueryNén ảnh (Client): browser-image-compression5. Thiết kế Dữ liệu (Data Design)Dữ liệu được lưu trong 2 file CSV.5.1. channels.csvLưu thông tin về các kênh chat (mỗi user là một kênh).Cột: channelId (sử dụng email của user), userEmail, createdAt5.2. messages.csvLưu toàn bộ tin nhắn của tất cả các kênh.Cột: messageId (UUID), channelId, sender ('user' hoặc 'admin'), type ('text' hoặc 'image'), content, timestampGiải thích:type: Xác định loại tin nhắn.content:Nếu type là 'text', content chứa nội dung tin nhắn.Nếu type là 'image', content chứa đường dẫn (URL) tới file ảnh trên server (ví dụ: /uploads/1677826800.jpg).6. Luồng xử lý các tính năng chính6.1. Luồng Gửi Hình ảnhĐây là luồng xử lý phức tạp nhất, kết hợp cả HTTP request và Socket.IO.Client: User/Admin chọn một file ảnh.Client (JS): Kiểm tra kích thước file (phải < 5MB).Client (JS): Sử dụng thư viện browser-image-compression để nén ảnh.Client (JS): Gửi file ảnh đã nén bằng fetch tới endpoint POST /upload của server.Server: Middleware multer nhận và lưu file ảnh vào thư mục /public/uploads.Server: Endpoint /upload trả về JSON chứa URL của ảnh, ví dụ: { "url": "/uploads/1677826800.jpg" }.Client (JS): Nhận được URL.Client (JS): Gửi một tin nhắn qua Socket.IO với type: 'image' và content: <URL nhận được>.Server (Socket.IO): Nhận tin nhắn, lưu vào messages.csv, và phát tin nhắn này tới người nhận.Client (Người nhận): Nhận được tin nhắn, kiểm tra type là 'image', và render thẻ <img> ra giao diện chat.7. Code mẫu (Sample Code)7.1. Thư viện chat-widget.js (Phía Client)Cách sử dụng trên trang HTML:<!-- index.html -->
<html>
<head>
    <title>My Awesome Website</title>
</head>
<body>
    <h1>Welcome!</h1>
    
    <!-- 1. Nhúng thư viện Socket.IO client -->
    <script src="http://YOUR_SERVER_ADDRESS/socket.io/socket.io.js"></script>
    <!-- 2. Nhúng thư viện nén ảnh -->
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.1/dist/browser-image-compression.js"></script>
    <!-- 3. Nhúng thư viện chat widget -->
    <script src="http://YOUR_SERVER_ADDRESS/js/chat-widget.js"></script>
    <script>
        // Khởi tạo widget
        MyChatWidget.init();

        // Hoặc khởi tạo với email của user đã đăng nhập
        // MyChatWidget.init({ email: 'john.doe@example.com' });
    </script>
</body>
</html>
Mã nguồn chat-widget.js:// public/js/chat-widget.js
(function() {
    const SERVER_URL = "http://localhost:3000"; // Thay bằng địa chỉ server của bạn
    let userEmail = null;
    let socket = null;

    window.MyChatWidget = {
        init: function(config = {}) {
            if (config.email) userEmail = config.email;
            injectDOM();
            if (window.jQuery) {
                setupEventListeners();
            } else {
                const script = document.createElement('script');
                script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
                script.onload = () => setupEventListeners();
                document.head.appendChild(script);
            }
        }
    };

    function injectDOM() {
        // Tiêm CSS và HTML của widget vào trang
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = `${SERVER_URL}/css/widget.css`;
        document.head.appendChild(style);

        const widgetHtml = `
            <div id="chat-bubble">💬</div>
            <div id="chat-window" class="hidden">
                <div id="chat-header">Chat với Admin</div>
                <div id="chat-body">
                    <div id="chat-messages"></div>
                    <div id="chat-login" class="hidden">
                        <p>Vui lòng nhập email để bắt đầu</p>
                        <input type="email" id="email-input" placeholder="your@email.com" />
                        <button id="start-chat-btn">Bắt đầu</button>
                    </div>
                </div>
                <div id="chat-footer">
                    <button id="attach-btn">📎</button>
                    <input type="file" id="image-upload-input" accept="image/*" style="display: none;" />
                    <input type="text" id="message-input" placeholder="Nhập tin nhắn..." disabled />
                    <button id="send-btn" disabled>Gửi</button>
                </div>
            </div>
        `;
        document.body.innerHTML += widgetHtml;
    }

    function setupEventListeners() {
        $('#chat-bubble').on('click', () => {
            $('#chat-window').toggleClass('hidden');
            if (!$('#chat-window').hasClass('hidden') && !socket) {
                if (userEmail) connectToChat();
                else $('#chat-login').removeClass('hidden');
            }
        });
        $('#start-chat-btn').on('click', () => {
            const email = $('#email-input').val();
            if (email) {
                userEmail = email;
                connectToChat();
            }
        });
        $('#send-btn').on('click', sendMessage);
        $('#message-input').on('keypress', (e) => e.which === 13 && sendMessage());
        $('#attach-btn').on('click', () => $('#image-upload-input').click());
        $('#image-upload-input').on('change', handleImageUpload);
    }

    function connectToChat() {
        $('#chat-login').addClass('hidden');
        $('#message-input, #send-btn, #attach-btn').prop('disabled', false);
        socket = io(SERVER_URL);
        socket.on('connect', () => socket.emit('user:join', { email: userEmail }));
        socket.on('chat:history', (messages) => {
            $('#chat-messages').empty();
            messages.forEach(msg => appendMessage(msg));
        });
        socket.on('chat:message', (message) => appendMessage(message));
    }

    function sendMessage() {
        const content = $('#message-input').val();
        if (content.trim() && socket) {
            const message = { sender: 'user', type: 'text', content, channelId: userEmail, timestamp: new Date() };
            socket.emit('chat:message', message);
            appendMessage(message);
            $('#message-input').val('');
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Lỗi: Kích thước ảnh không được vượt quá 5MB.');
            return;
        }
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        try {
            const compressedFile = await imageCompression(file, options);
            const formData = new FormData();
            formData.append('image', compressedFile, compressedFile.name);
            const response = await fetch(`${SERVER_URL}/upload`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Upload thất bại!');
            const result = await response.json();
            const message = { sender: 'user', type: 'image', content: result.url, channelId: userEmail, timestamp: new Date() };
            socket.emit('chat:message', message);
            appendMessage(message);
        } catch (error) {
            console.error('Lỗi xử lý ảnh:', error);
            alert('Đã có lỗi xảy ra khi gửi ảnh.');
        } finally {
            event.target.value = '';
        }
    }

    function appendMessage(msg) {
        const messageClass = msg.sender === 'user' ? 'user-message' : 'admin-message';
        const $chatMessages = $('#chat-messages');
        let messageContent = '';
        if (msg.type === 'image') {
            messageContent = `<img src="${SERVER_URL}${msg.content}" alt="Hình ảnh" class="chat-image">`;
        } else {
            messageContent = msg.content;
        }
        $chatMessages.append(`<div class="message ${messageClass}">${messageContent}</div>`);
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    }
})();
7.2. Server (server.js)// src/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const exphbs = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const { initializeStorage, getAllChannels } = require('./services/storageService');
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

// Cấu hình
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Cấu hình Multer để lưu file
const diskStorage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb('Error: Chỉ hỗ trợ upload file ảnh!');
    }
}).single('image');

// Routes
app.get('/admin', (req, res) => {
    const channels = getAllChannels();
    res.render('admin', { layout: 'main', channels });
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message || err });
        if (!req.file) return res.status(400).json({ error: 'Không có file nào được chọn!' });
        res.status(200).json({ url: `/uploads/${req.file.filename}` });
    });
});

// Khởi tạo Storage và Socket
initializeStorage();
initializeSocket(io);

// Chạy server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
7.3. Dịch vụ Lưu trữ (storageService.js)// src/services/storageService.js
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const CHANNELS_PATH = path.join(DATA_DIR, 'channels.csv');
const MESSAGES_PATH = path.join(DATA_DIR, 'messages.csv');

function initializeStorage() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(CHANNELS_PATH)) fs.writeFileSync(CHANNELS_PATH, 'channelId,userEmail,createdAt\n');
    if (!fs.existsSync(MESSAGES_PATH)) fs.writeFileSync(MESSAGES_PATH, 'messageId,channelId,sender,type,content,timestamp\n');
}

function getAllChannels() {
    const fileContent = fs.readFileSync(CHANNELS_PATH);
    return parse(fileContent, { columns: true, skip_empty_lines: true });
}

function getOrCreateChannel(email) {
    const allChannels = getAllChannels();
    let channel = allChannels.find(ch => ch.userEmail === email);
    if (!channel) {
        channel = { channelId: email, userEmail: email, createdAt: new Date().toISOString() };
        const csvString = stringify([channel], { header: false });
        fs.appendFileSync(CHANNELS_PATH, csvString);
    }
    return channel;
}

function getMessages(channelId) {
    const fileContent = fs.readFileSync(MESSAGES_PATH);
    const allMessages = parse(fileContent, { columns: true, skip_empty_lines: true });
    return allMessages.filter(msg => msg.channelId === channelId);
}

function addMessage(messageData) {
    const messageRecord = { messageId: require('crypto').randomUUID(), ...messageData };
    const csvString = stringify([messageRecord], { header: false });
    fs.appendFileSync(MESSAGES_PATH, csvString);
    return messageRecord;
}

module.exports = { initializeStorage, getAllChannels, getOrCreateChannel, getMessages, addMessage };
7.4. Dịch vụ Socket (socketService.js)// src/services/socketService.js
const { getOrCreateChannel, getMessages, addMessage } = require('./storageService');

function initializeSocket(io) {
    const adminNamespace = io.of("/admin"); // Namespace riêng cho admin

    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on('user:join', ({ email }) => {
            const channel = getOrCreateChannel(email);
            socket.join(channel.channelId);
            const messages = getMessages(channel.channelId);
            socket.emit('chat:history', messages);
            adminNamespace.emit('admin:newUser', channel);
        });

        socket.on('chat:message', (message) => {
            const savedMessage = addMessage(message);
            adminNamespace.emit('admin:newMessage', savedMessage);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    adminNamespace.on('connection', (socket) => {
        console.log(`Admin connected: ${socket.id}`);

        socket.on('chat:message', (message) => {
            const savedMessage = addMessage(message);
            io.to(message.channelId).emit('chat:message', savedMessage);
        });
    });
}

module.exports = initializeSocket;

