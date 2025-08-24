# Tài liệu Kỹ thuật: Tính năng Gửi Tin nhắn Broadcast (Đơn giản hóa)
**Phiên bản: 2.0**  
**Ngày cập nhật: 24/08/2025**

## 1. Tổng quan tính năng (Đơn giản hóa)

### 1.1. Mục tiêu
Thêm tính năng gửi tin nhắn broadcast cho Admin với 2 chức năng chính:
1. **Gửi tin nhắn tới toàn thể nhân viên** - Tin nhắn được gửi tới tất cả nhân viên trong hệ thống
2. **Gửi tin nhắn tới nhân viên của phòng ban cụ thể** - Tin nhắn chỉ được gửi tới nhân viên thuộc phòng ban được chọn

### 1.2. Cách tiếp cận đơn giản
- **Không tạo bảng mới** - Sử dụng 2 bảng hiện tại: `channels` và `messages`
- **Tạo channel cho từng username** - Mỗi username từ API sẽ có 1 channel riêng
- **Gửi message với trạng thái unread** - Sử dụng field `user_read_at = NULL` để đánh dấu unread
- **Broadcast = Gửi cùng 1 message tới nhiều channels**

### 1.3. API External cần tích hợp
- **API lấy danh sách phòng ban**: `POST http://103.216.119.80:8080/chat/get-all-departments`
- **API lấy danh sách nhân viên**: `POST http://103.216.119.80:8080/chat/get-all-employees`

## 2. Cấu trúc dữ liệu (Sử dụng bảng hiện tại)

### 2.1. Bảng `channels` (Hiện tại - Không thay đổi)
```sql
-- Bảng channels hiện tại
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2. Bảng `messages` (Hiện tại - Không thay đổi)
```sql
-- Bảng messages hiện tại
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message_id UUID UNIQUE DEFAULT gen_random_uuid(),
    channel_id VARCHAR(255) NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('user', 'admin')) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('text', 'image')) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    admin_read_at TIMESTAMP,
    user_read_at TIMESTAMP,  -- NULL = unread, NOT NULL = đã đọc
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE
);
```

### 2.3. Logic Broadcast đơn giản
```javascript
// Ví dụ: Gửi broadcast tới 3 nhân viên
// Tạo 3 messages giống nhau với channel_id khác nhau
// user_read_at = NULL (unread)

// Message 1: Gửi tới user "thangnq1"
{
  channel_id: "thangnq1",
  sender: "admin",
  type: "text",
  content: "Thông báo quan trọng!",
  user_read_at: NULL  // Unread
}

// Message 2: Gửi tới user "ducnv1"  
{
  channel_id: "ducnv1",
  sender: "admin", 
  type: "text",
  content: "Thông báo quan trọng!",
  user_read_at: NULL  // Unread
}

// Message 3: Gửi tới user "user3"
{
  channel_id: "user3",
  sender: "admin",
  type: "text", 
  content: "Thông báo quan trọng!",
  user_read_at: NULL  // Unread
}
```

## 3. Các file cần tạo mới

### 3.1. `src/services/externalApiService.js`
```javascript
// Service để gọi API external
const axios = require('axios');

const EXTERNAL_API_BASE = 'http://103.216.119.80:8080/chat';

class ExternalApiService {
    static async getAllDepartments() {
        try {
            const response = await axios.post(`${EXTERNAL_API_BASE}/get-all-departments`, '', {
                headers: { 'accept': '*/*' }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    static async getAllEmployees(departmentId = null) {
        try {
            const response = await axios.post(`${EXTERNAL_API_BASE}/get-all-employees`, {
                departmentId: departmentId
            }, {
                headers: { 
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }
}

module.exports = ExternalApiService;
```

### 3.2. `src/services/broadcastService.js`
```javascript
// Service xử lý logic broadcast đơn giản
const { pool } = require('../config/database');
const ExternalApiService = require('./externalApiService');
const { getOrCreateChannel, addMessage } = require('./dbService');

class BroadcastService {
    // Lấy danh sách phòng ban từ API
    static async getDepartments() {
        try {
            return await ExternalApiService.getAllDepartments();
        } catch (error) {
            console.error('Error getting departments:', error);
            return [];
        }
    }

    // Lấy danh sách nhân viên từ API
    static async getEmployees(departmentId = null) {
        try {
            return await ExternalApiService.getAllEmployees(departmentId);
        } catch (error) {
            console.error('Error getting employees:', error);
            return [];
        }
    }

    // Gửi broadcast message
    static async sendBroadcastMessage(messageData) {
        const { content, type, targetType, targetDepartmentId } = messageData;
        
        try {
            // 1. Lấy danh sách nhân viên cần gửi
            let employees;
            if (targetType === 'all_employees') {
                employees = await this.getEmployees();
            } else {
                employees = await this.getEmployees(targetDepartmentId);
            }

            if (employees.length === 0) {
                throw new Error('Không có nhân viên nào để gửi tin nhắn');
            }

            // 2. Tạo hoặc lấy channel cho từng username
            const channels = [];
            for (const employee of employees) {
                const username = employee.username;
                const channel = await getOrCreateChannel(username);
                channels.push(channel);
            }

            // 3. Gửi message tới từng channel
            const sentMessages = [];
            for (const channel of channels) {
                const messageData = {
                    channelId: channel.channel_id,
                    sender: 'admin',
                    type: type,
                    content: content,
                    timestamp: new Date().toISOString()
                    // user_read_at = NULL (mặc định) = unread
                };

                const message = await addMessage(messageData);
                sentMessages.push(message);
            }

            return {
                success: true,
                message: `Đã gửi tin nhắn tới ${sentMessages.length} nhân viên`,
                sentCount: sentMessages.length,
                messages: sentMessages
            };

        } catch (error) {
            console.error('Error sending broadcast:', error);
            throw error;
        }
    }

    // Lấy lịch sử broadcast (tìm messages admin gửi tới nhiều channels cùng lúc)
    static async getBroadcastHistory() {
        const client = await pool.connect();
        try {
            // Tìm các messages admin gửi cùng nội dung trong khoảng thời gian ngắn
            const result = await client.query(`
                SELECT 
                    content,
                    type,
                    timestamp,
                    COUNT(*) as recipient_count
                FROM messages 
                WHERE sender = 'admin' 
                AND timestamp >= NOW() - INTERVAL '30 days'
                GROUP BY content, type, timestamp
                HAVING COUNT(*) > 1
                ORDER BY timestamp DESC
                LIMIT 50
            `);
            
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Lấy thống kê broadcast
    static async getBroadcastStats() {
        const client = await pool.connect();
        try {
            // Đếm tổng số broadcast messages (admin gửi tới nhiều người)
            const totalBroadcasts = await client.query(`
                SELECT COUNT(DISTINCT content) as total
                FROM messages 
                WHERE sender = 'admin' 
                AND timestamp >= NOW() - INTERVAL '30 days'
                AND content IN (
                    SELECT content 
                    FROM messages 
                    WHERE sender = 'admin' 
                    GROUP BY content 
                    HAVING COUNT(*) > 1
                )
            `);

            // Đếm tổng số unread broadcast messages
            const unreadBroadcasts = await client.query(`
                SELECT COUNT(*) as total
                FROM messages 
                WHERE sender = 'admin' 
                AND user_read_at IS NULL
                AND content IN (
                    SELECT content 
                    FROM messages 
                    WHERE sender = 'admin' 
                    GROUP BY content 
                    HAVING COUNT(*) > 1
                )
            `);

            return {
                totalBroadcasts: parseInt(totalBroadcasts.rows[0].total),
                unreadBroadcasts: parseInt(unreadBroadcasts.rows[0].total)
            };
        } finally {
            client.release();
        }
    }
}

module.exports = BroadcastService;
```

### 3.3. `views/broadcast.hbs`
```handlebars
<div class="broadcast-container">
    <div class="broadcast-header">
        <h2>📢 Gửi Tin nhắn Broadcast</h2>
        <div class="broadcast-stats">
            <span class="stat-item">
                <i class="fas fa-users"></i>
                <span id="total-employees">0</span> nhân viên
            </span>
            <span class="stat-item">
                <i class="fas fa-building"></i>
                <span id="total-departments">0</span> phòng ban
            </span>
        </div>
    </div>

    <div class="broadcast-form">
        <div class="form-group">
            <label for="target-type">Đối tượng nhận:</label>
            <select id="target-type" class="form-control">
                <option value="all_employees">Tất cả nhân viên</option>
                <option value="department">Phòng ban cụ thể</option>
            </select>
        </div>

        <div class="form-group" id="department-select-group" style="display: none;">
            <label for="department-select">Chọn phòng ban:</label>
            <select id="department-select" class="form-control">
                <option value="">-- Chọn phòng ban --</option>
            </select>
        </div>

        <div class="form-group">
            <label for="message-type">Loại tin nhắn:</label>
            <select id="message-type" class="form-control">
                <option value="text">Văn bản</option>
                <option value="image">Hình ảnh</option>
            </select>
        </div>

        <div class="form-group" id="text-content-group">
            <label for="message-content">Nội dung tin nhắn:</label>
            <textarea id="message-content" class="form-control" rows="4" placeholder="Nhập nội dung tin nhắn..."></textarea>
        </div>

        <div class="form-group" id="image-content-group" style="display: none;">
            <label for="image-upload">Chọn hình ảnh:</label>
            <input type="file" id="image-upload" class="form-control" accept="image/*">
            <div id="image-preview" class="mt-2"></div>
        </div>

        <div class="form-group">
            <button id="send-broadcast-btn" class="btn btn-primary">
                <i class="fas fa-paper-plane"></i>
                Gửi Tin nhắn
            </button>
            <button id="preview-btn" class="btn btn-secondary">
                <i class="fas fa-eye"></i>
                Xem trước
            </button>
        </div>
    </div>

    <div class="broadcast-history">
        <h3>📋 Lịch sử Broadcast</h3>
        <div id="broadcast-list">
            <!-- Danh sách broadcast messages -->
        </div>
    </div>
</div>

<!-- Preview Modal -->
<div class="modal fade" id="previewModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Xem trước tin nhắn</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="preview-info">
                    <p><strong>Đối tượng:</strong> <span id="preview-target"></span></p>
                    <p><strong>Số lượng nhận:</strong> <span id="preview-count"></span> nhân viên</p>
                </div>
                <div class="preview-message">
                    <h6>Nội dung tin nhắn:</h6>
                    <div id="preview-content"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" id="confirm-send-btn">Xác nhận gửi</button>
            </div>
        </div>
    </div>
</div>
```

### 3.4. `public/js/broadcast.js`
```javascript
// Broadcast functionality
$(document).ready(function() {
    let selectedImageUrl = null;
    let currentPreviewData = null;

    // Initialize
    initializeBroadcast();

    function initializeBroadcast() {
        loadDepartments();
        loadBroadcastHistory();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Target type change
        $('#target-type').on('change', function() {
            const targetType = $(this).val();
            if (targetType === 'department') {
                $('#department-select-group').show();
                loadEmployeesForDepartment();
            } else {
                $('#department-select-group').hide();
                loadEmployeesForAll();
            }
        });

        // Department selection
        $('#department-select').on('change', function() {
            const departmentId = $(this).val();
            if (departmentId) {
                loadEmployeesForDepartment(departmentId);
            }
        });

        // Message type change
        $('#message-type').on('change', function() {
            const messageType = $(this).val();
            if (messageType === 'image') {
                $('#text-content-group').hide();
                $('#image-content-group').show();
            } else {
                $('#text-content-group').show();
                $('#image-content-group').hide();
            }
        });

        // Image upload
        $('#image-upload').on('change', handleImageUpload);

        // Send broadcast
        $('#send-broadcast-btn').on('click', sendBroadcast);
        $('#preview-btn').on('click', showPreview);
        $('#confirm-send-btn').on('click', confirmSendBroadcast);
    }

    async function loadDepartments() {
        try {
            const response = await fetch('/api/departments');
            const departments = await response.json();
            
            const select = $('#department-select');
            select.empty().append('<option value="">-- Chọn phòng ban --</option>');
            
            departments.forEach(dept => {
                select.append(`<option value="${dept.departmentId}">${dept.departmentName}</option>`);
            });
            
            $('#total-departments').text(departments.length);
        } catch (error) {
            console.error('Error loading departments:', error);
            showToast('Lỗi', 'Không thể tải danh sách phòng ban', 'error');
        }
    }

    async function loadEmployeesForAll() {
        try {
            const response = await fetch('/api/employees');
            const employees = await response.json();
            $('#total-employees').text(employees.length);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    async function loadEmployeesForDepartment(departmentId) {
        try {
            const response = await fetch(`/api/employees?departmentId=${departmentId}`);
            const employees = await response.json();
            $('#total-employees').text(employees.length);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('Lỗi', 'Kích thước ảnh không được vượt quá 5MB', 'error');
            return;
        }

        try {
            // Compress image
            let fileToUpload = file;
            if (window.imageCompression) {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                fileToUpload = await imageCompression(file, options);
            }

            // Upload
            const formData = new FormData();
            formData.append('image', fileToUpload);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            selectedImageUrl = result.url;

            // Show preview
            $('#image-preview').html(`
                <img src="${result.url}" class="img-thumbnail" style="max-width: 200px;">
                <button type="button" class="btn btn-sm btn-danger mt-1" onclick="removeImage()">
                    <i class="fas fa-times"></i> Xóa
                </button>
            `);
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Lỗi', 'Không thể tải lên hình ảnh', 'error');
        }
    }

    function removeImage() {
        selectedImageUrl = null;
        $('#image-upload').val('');
        $('#image-preview').empty();
    }

    async function showPreview() {
        const formData = getFormData();
        if (!formData) return;

        try {
            // Get employee count
            let employeeCount = 0;
            if (formData.targetType === 'all_employees') {
                const response = await fetch('/api/employees');
                const employees = await response.json();
                employeeCount = employees.length;
            } else {
                const response = await fetch(`/api/employees?departmentId=${formData.targetDepartmentId}`);
                const employees = await response.json();
                employeeCount = employees.length;
            }

            // Show preview
            $('#preview-target').text(formData.targetType === 'all_employees' ? 'Tất cả nhân viên' : 'Phòng ban cụ thể');
            $('#preview-count').text(employeeCount);

            let contentHtml = '';
            if (formData.type === 'image') {
                contentHtml = `<img src="${formData.content}" class="img-fluid" style="max-width: 100%;">`;
            } else {
                contentHtml = `<p>${escapeHtml(formData.content)}</p>`;
            }
            $('#preview-content').html(contentHtml);

            currentPreviewData = { ...formData, employeeCount };
            
            const modal = new bootstrap.Modal('#previewModal');
            modal.show();
        } catch (error) {
            console.error('Error showing preview:', error);
            showToast('Lỗi', 'Không thể hiển thị xem trước', 'error');
        }
    }

    async function sendBroadcast() {
        const formData = getFormData();
        if (!formData) return;

        if (!confirm('Bạn có chắc chắn muốn gửi tin nhắn này?')) return;

        await sendBroadcastMessage(formData);
    }

    async function confirmSendBroadcast() {
        if (!currentPreviewData) return;

        await sendBroadcastMessage(currentPreviewData);
        
        const modal = bootstrap.Modal.getInstance('#previewModal');
        modal.hide();
    }

    async function sendBroadcastMessage(formData) {
        try {
            const response = await fetch('/api/broadcast/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Send failed');

            const result = await response.json();
            
            showToast('Thành công', `Đã gửi tin nhắn tới ${result.sentCount} nhân viên`, 'success');
            
            // Reset form
            resetForm();
            loadBroadcastHistory();
        } catch (error) {
            console.error('Error sending broadcast:', error);
            showToast('Lỗi', 'Không thể gửi tin nhắn', 'error');
        }
    }

    function getFormData() {
        const targetType = $('#target-type').val();
        const targetDepartmentId = targetType === 'department' ? $('#department-select').val() : null;
        const messageType = $('#message-type').val();
        
        if (targetType === 'department' && !targetDepartmentId) {
            showToast('Lỗi', 'Vui lòng chọn phòng ban', 'error');
            return null;
        }

        let content = '';
        if (messageType === 'text') {
            content = $('#message-content').val().trim();
            if (!content) {
                showToast('Lỗi', 'Vui lòng nhập nội dung tin nhắn', 'error');
                return null;
            }
        } else {
            content = selectedImageUrl;
            if (!content) {
                showToast('Lỗi', 'Vui lòng chọn hình ảnh', 'error');
                return null;
            }
        }

        return {
            content,
            type: messageType,
            targetType,
            targetDepartmentId
        };
    }

    function resetForm() {
        $('#target-type').val('all_employees').trigger('change');
        $('#message-type').val('text').trigger('change');
        $('#message-content').val('');
        removeImage();
    }

    async function loadBroadcastHistory() {
        try {
            const response = await fetch('/api/broadcast/history');
            const broadcasts = await response.json();
            
            const container = $('#broadcast-list');
            if (broadcasts.length === 0) {
                container.html('<p class="text-muted">Chưa có tin nhắn broadcast nào</p>');
                return;
            }

            let html = '';
            broadcasts.forEach(broadcast => {
                const contentPreview = broadcast.type === 'image' ? '📷 Hình ảnh' : broadcast.content.substring(0, 50);
                
                html += `
                    <div class="broadcast-item">
                        <div class="broadcast-header">
                            <span class="broadcast-time">${formatDate(broadcast.timestamp)}</span>
                        </div>
                        <div class="broadcast-content">${contentPreview}</div>
                        <div class="broadcast-stats">
                            <span class="sent-count">Đã gửi: ${broadcast.recipient_count} nhân viên</span>
                        </div>
                    </div>
                `;
            });
            
            container.html(html);
        } catch (error) {
            console.error('Error loading broadcast history:', error);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(title, message, type = 'info') {
        // Implement toast notification
        console.log(`${title}: ${message}`);
    }
});

// Global function for image removal
function removeImage() {
    $('#image-upload').val('');
    $('#image-preview').empty();
    selectedImageUrl = null;
}
```

## 4. Các file cần sửa đổi

### 4.1. `src/server.js` - Thêm routes mới
```javascript
// Thêm vào phần routes
const BroadcastService = require('./services/broadcastService');

// API Routes cho broadcast
app.get('/broadcast', async (req, res) => {
    try {
        res.render('broadcast', { 
            layout: 'main', 
            title: 'Broadcast Messages'
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
```

### 4.2. `src/services/socketService.js` - Thêm xử lý broadcast
```javascript
// Thêm vào phần admin namespace
socket.on('admin:sendBroadcast', async (broadcastData) => {
    try {
        const { content, type, targetType, targetDepartmentId } = broadcastData;
        
        // Gọi broadcast service
        const result = await BroadcastService.sendBroadcastMessage({
            content,
            type,
            targetType,
            targetDepartmentId
        });
        
        // Thông báo cho admin
        socket.emit('admin:broadcastSent', result);
        
        // Gửi tin nhắn tới các users qua Socket.IO
        if (result.messages && result.messages.length > 0) {
            result.messages.forEach(message => {
                io.to(message.channelId).emit('chat:message', message);
            });
        }
        
        console.log(`Broadcast sent to ${result.sentCount} users`);
    } catch (error) {
        console.error('Error sending broadcast:', error);
        socket.emit('error', { message: 'Failed to send broadcast' });
    }
});
```

### 4.3. `views/layouts/main.hbs` - Thêm navigation
```handlebars
<!-- Thêm vào navigation -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="/admin">Chat Admin</a>
        <div class="navbar-nav">
            <a class="nav-link" href="/admin">Dashboard</a>
            <a class="nav-link" href="/broadcast">Broadcast</a>
        </div>
    </div>
</nav>
```

### 4.4. `public/css/admin.css` - Thêm styles cho broadcast
```css
/* Broadcast styles */
.broadcast-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.broadcast-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e9ecef;
}

.broadcast-stats {
    display: flex;
    gap: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6c757d;
}

.broadcast-form {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 8px;
    display: block;
}

.form-control {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.form-control:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.broadcast-history {
    background: white;
    padding: 25px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.broadcast-item {
    padding: 15px;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 10px;
}

.broadcast-item:last-child {
    border-bottom: none;
}

.broadcast-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.broadcast-time {
    font-size: 12px;
    color: #6c757d;
}

.broadcast-content {
    margin-bottom: 8px;
    color: #495057;
}

.broadcast-stats {
    font-size: 12px;
    color: #6c757d;
}

.sent-count {
    background: #e9ecef;
    padding: 2px 8px;
    border-radius: 12px;
}

#image-preview {
    margin-top: 10px;
}

.img-thumbnail {
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 4px;
}

.preview-info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.preview-info p {
    margin-bottom: 8px;
}

.preview-message {
    border: 1px solid #dee2e6;
    padding: 15px;
    border-radius: 4px;
}

.preview-message h6 {
    margin-bottom: 10px;
    color: #495057;
}
```

## 5. Luồng hoạt động đơn giản

### 5.1. Luồng gửi broadcast
1. **Admin chọn đối tượng**: Tất cả nhân viên hoặc phòng ban cụ thể
2. **Lấy danh sách nhân viên** từ API external
3. **Tạo channel cho từng username** (nếu chưa có)
4. **Gửi cùng 1 message** tới tất cả channels với `user_read_at = NULL`
5. **Gửi qua Socket.IO** tới các users online
6. **Lưu lịch sử** bằng cách đếm messages có cùng content

### 5.2. Luồng nhận broadcast
1. **User nhận message** qua Socket.IO
2. **Hiển thị trong widget** với trạng thái unread
3. **Đánh dấu đã đọc** khi user xem tin nhắn
4. **Cập nhật `user_read_at`** trong database

## 6. Ưu điểm của cách tiếp cận này

### 6.1. Đơn giản
- ✅ Không cần tạo bảng mới
- ✅ Sử dụng logic hiện tại
- ✅ Dễ maintain và debug

### 6.2. Hiệu quả
- ✅ Tận dụng cơ chế unread hiện có
- ✅ Không cần sync data phức tạp
- ✅ Performance tốt với số lượng nhân viên lớn

### 6.3. Linh hoạt
- ✅ Dễ dàng track từng message riêng lẻ
- ✅ Có thể reply cho từng user
- ✅ Tương thích với tính năng hiện tại

## 7. Testing

### 7.1. Test cases
- [ ] Gửi broadcast tới tất cả nhân viên
- [ ] Gửi broadcast tới phòng ban cụ thể
- [ ] Upload và gửi hình ảnh broadcast
- [ ] Kiểm tra trạng thái unread
- [ ] Test với API external không khả dụng 

## 8. Deployment

### 8.1. Các bước triển khai
1. **Cài đặt dependencies** (`npm install axios`)
2. **Deploy code mới**
3. **Test tính năng**
4. **Monitor performance**

### 8.2. Monitoring
- Theo dõi số lượng broadcast messages
- Monitor API external response time
- Kiểm tra error rate của broadcast
- Theo dõi memory usage
