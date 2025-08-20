// Chat Widget Library
(function() {
    // Configuration
    const SERVER_URL = window.location.origin; // Auto-detect server URL
    let userEmail = null;
    let socket = null;
    let isConnected = false;
    let messageQueue = [];

    // Main widget object
    window.MyChatWidget = {
        init: function(config = {}) {
            console.log('Initializing Chat Widget...');
            
            if (config.email) {
                userEmail = config.email;
            }
            
            // Load dependencies and setup
            loadDependencies().then(() => {
                injectCSS();
                injectDOM();
                setupEventListeners();
                console.log('Chat Widget initialized successfully');
            }).catch(error => {
                console.error('Failed to initialize Chat Widget:', error);
            });
        }
    };

    function loadDependencies() {
        return new Promise((resolve, reject) => {
            // Check if jQuery is already loaded
            if (window.jQuery) {
                resolve();
                return;
            }
            
            // Load jQuery if not present
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = () => {
                console.log('jQuery loaded for chat widget');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load jQuery'));
            document.head.appendChild(script);
        });
    }

    function injectCSS() {
        // Check if CSS is already injected
        if (document.getElementById('chat-widget-styles')) return;
        
        const link = document.createElement('link');
        link.id = 'chat-widget-styles';
        link.rel = 'stylesheet';
        link.href = `${SERVER_URL}/css/widget.css`;
        document.head.appendChild(link);
    }

    function injectDOM() {
        // Check if widget is already injected
        if (document.getElementById('chat-widget-container')) {
            console.log('Chat widget already exists');
            return;
        }

        const widgetHtml = `
            <div id="chat-widget-container">
                <!-- Chat Bubble -->
                <div id="chat-bubble" title="Bắt đầu trò chuyện">
                    <i class="chat-icon">💬</i>
                    <span id="unread-count" class="unread-badge" style="display: none;">0</span>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-hidden">
                    <!-- Header -->
                    <div id="chat-header">
                        <div class="chat-header-content">
                            <div class="chat-header-info">
                                <h4>Chat với Admin</h4>
                                <span id="connection-status">Đang kết nối...</span>
                            </div>
                            <div class="chat-header-actions">
                                <button id="minimize-btn" title="Thu nhỏ">
                                    <i class="icon">−</i>
                                </button>
                                <button id="close-btn" title="Đóng">
                                    <i class="icon">×</i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div id="chat-body">
                        <!-- Login Form -->
                        <div id="chat-login" class="chat-screen">
                            <div class="login-content">
                                <div class="welcome-message">
                                    <h3>👋 Xin chào!</h3>
                                    <p>Vui lòng nhập email để bắt đầu trò chuyện với chúng tôi</p>
                                </div>
                                <div class="login-form">
                                    <input type="email" id="email-input" placeholder="your@email.com" required />
                                    <button id="start-chat-btn">Bắt đầu chat</button>
                                </div>
                            </div>
                        </div>

                        <!-- Chat Messages -->
                        <div id="chat-messages" class="chat-screen chat-hidden">
                            <div class="messages-container">
                                <!-- Messages will be inserted here -->
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div id="chat-footer" class="chat-hidden">
                        <div class="input-container">
                            <button id="attach-btn" class="attach-button" title="Gửi hình ảnh" disabled>
                                <i class="icon">📎</i>
                            </button>
                            <input type="text" id="message-input" placeholder="Nhập tin nhắn..." disabled />
                            <button id="send-btn" class="send-button" title="Gửi" disabled>
                                <i class="icon">➤</i>
                            </button>
                        </div>
                        <input type="file" id="image-upload-input" accept="image/*" style="display: none;" />
                        <div class="footer-info">
                            <small>Nhấn Enter để gửi nhanh</small>
                        </div>
                    </div>
                </div>

                <!-- Loading Overlay -->
                <div id="chat-loading" class="loading-overlay chat-hidden">
                    <div class="loading-spinner"></div>
                    <p>Đang kết nối...</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHtml);
    }

    function setupEventListeners() {
        const $ = window.jQuery;

        // Chat bubble click
        $('#chat-bubble').on('click', toggleChatWindow);

        // Header buttons
        $('#minimize-btn').on('click', minimizeChatWindow);
        $('#close-btn').on('click', closeChatWindow);

        // Login
        $('#start-chat-btn').on('click', startChat);
        $('#email-input').on('keypress', function(e) {
            if (e.which === 13) startChat();
        });

        // Messaging
        $('#send-btn').on('click', sendMessage);
        $('#message-input').on('keypress', function(e) {
            if (e.which === 13) sendMessage();
        });

        // File upload
        $('#attach-btn').on('click', () => $('#image-upload-input').click());
        $('#image-upload-input').on('change', handleImageUpload);

        // Auto-resize message input
        $('#message-input').on('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    function toggleChatWindow() {
        const $ = window.jQuery;
        const chatWindow = $('#chat-window');
        
        if (chatWindow.hasClass('chat-hidden')) {
            showChatWindow();
        } else {
            minimizeChatWindow();
        }
    }

    function showChatWindow() {
        const $ = window.jQuery;
        $('#chat-window').removeClass('chat-hidden');
        $('#chat-bubble').addClass('chat-active');
        
        // Clear unread count
        $('#unread-count').hide().text('0');
        
        // If not connected and no email, show login
        if (!isConnected && !userEmail) {
            showLoginScreen();
        } else if (!isConnected && userEmail) {
            connectToChat();
        }
    }

    function minimizeChatWindow() {
        const $ = window.jQuery;
        $('#chat-window').addClass('chat-hidden');
        $('#chat-bubble').removeClass('chat-active');
    }

    function closeChatWindow() {
        minimizeChatWindow();
        // Optionally disconnect socket
        if (socket) {
            socket.disconnect();
            socket = null;
            isConnected = false;
        }
    }

    function showLoginScreen() {
        const $ = window.jQuery;
        $('#chat-login').removeClass('chat-hidden');
        $('#chat-messages, #chat-footer').addClass('chat-hidden');
        $('#email-input').focus();
    }

    function startChat() {
        const $ = window.jQuery;
        const email = $('#email-input').val().trim();
        
        if (!email) {
            showAlert('Vui lòng nhập email hợp lệ');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Email không hợp lệ');
            return;
        }

        userEmail = email;
        connectToChat();
    }

    function connectToChat() {
        const $ = window.jQuery;
        
        showLoadingState();
        
        // Initialize socket connection
        socket = io(SERVER_URL);
        
        socket.on('connect', () => {
            console.log('Connected to chat server');
            socket.emit('user:join', { email: userEmail });
        });

        socket.on('chat:history', (messages) => {
            hideLoadingState();
            showChatScreen();
            displayMessages(messages);
            updateConnectionStatus('Đã kết nối');
            isConnected = true;
            
            // Process any queued messages
            processMessageQueue();
        });

        socket.on('chat:message', (message) => {
            appendMessage(message);
            if (socket) {
                socket.emit('chat:read', { messageIds: [message.messageId] });
            }

            // Show notification if window is minimized
            if ($('#chat-window').hasClass('chat-hidden')) {
                incrementUnreadCount();
                showNotification(message);
            }
        });

        socket.on('chat:messageSent', (message) => {
            appendMessage(message);
        });

        socket.on('chat:read', ({ messageIds, reader }) => {
            if (reader === 'admin') {
                markMessagesRead(messageIds);
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
            updateConnectionStatus('Mất kết nối');
            isConnected = false;
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            hideLoadingState();
            showAlert(error.message || 'Có lỗi xảy ra khi kết nối');
        });
    }

    function showChatScreen() {
        const $ = window.jQuery;
        $('#chat-login, #chat-loading').addClass('chat-hidden');
        $('#chat-messages, #chat-footer').removeClass('chat-hidden');
        $('#message-input, #send-btn, #attach-btn').prop('disabled', false);
        $('#message-input').focus();
    }

    function showLoadingState() {
        const $ = window.jQuery;
        $('#chat-loading').removeClass('chat-hidden');
        $('#chat-login').addClass('chat-hidden');
    }

    function hideLoadingState() {
        const $ = window.jQuery;
        $('#chat-loading').addClass('chat-hidden');
    }

    function displayMessages(messages) {
        const $ = window.jQuery;
        const container = $('.messages-container');
        container.empty();

        if (!messages || messages.length === 0) {
            container.html(`
                <div class="welcome-message-chat">
                    <p>👋 Chào bạn! Hãy bắt đầu trò chuyện với chúng tôi.</p>
                </div>
            `);
            return;
        }

        const adminIds = [];
        messages.forEach(message => {
            appendMessage(message, false);
            if (message.sender === 'admin' && !message.userReadAt) {
                adminIds.push(message.messageId);
            }
        });
        scrollToBottom();
        if (socket && adminIds.length) {
            socket.emit('chat:read', { messageIds: adminIds });
        }
    }

    function appendMessage(message, animate = true) {
        const $ = window.jQuery;
        const container = $('.messages-container');
        const messageClass = message.sender === 'user' ? 'message-user' : 'message-admin';
        const senderName = message.sender === 'user' ? 'Bạn' : 'Admin';

        let messageContent = '';
        if (message.type === 'image') {
            messageContent = `<img src="${SERVER_URL}${message.content}" alt="Hình ảnh" class="message-image" loading="lazy">`;
        } else {
            messageContent = escapeHtml(message.content);
        }

        const readText = message.sender === 'user' && message.adminReadAt ? 'Đã xem' : '';
        const messageHtml = `
            <div class="message ${messageClass}" data-id="${message.messageId}">
                <div class="message-content">
                    ${messageContent}
                </div>
                <div class="message-meta">
                    ${senderName} • ${formatTime(message.timestamp)}
                    <span class="read-status"${readText ? '' : ' style="display:none;"'}>${readText}</span>
                </div>
            </div>
        `;

        if (animate) {
            container.append(messageHtml);
            container.children().last().hide().fadeIn(300);
        } else {
            container.append(messageHtml);
        }

        scrollToBottom();
    }

    function sendMessage() {
        const $ = window.jQuery;
        const content = $('#message-input').val().trim();
        
        if (!content) return;
        
        if (!isConnected || !socket) {
            // Queue message if not connected
            messageQueue.push({
                type: 'text',
                content: content
            });
            showAlert('Tin nhắn sẽ được gửi khi kết nối lại');
            $('#message-input').val('');
            return;
        }

        const message = {
            type: 'text',
            content: content
        };

        socket.emit('chat:message', message);
        $('#message-input').val('').css('height', 'auto');
    }

    async function handleImageUpload(event) {
        const $ = window.jQuery;
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showAlert('Kích thước ảnh không được vượt quá 5MB.');
            return;
        }

        if (!isConnected) {
            showAlert('Vui lòng kết nối lại để gửi hình ảnh');
            return;
        }

        // Show uploading state
        const uploadingMessage = {
            sender: 'user',
            type: 'text',
            content: '📤 Đang tải lên hình ảnh...',
            timestamp: new Date().toISOString()
        };
        appendMessage(uploadingMessage);

        try {
            // Compress image if library is available
            let fileToUpload = file;
            if (window.imageCompression) {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                fileToUpload = await imageCompression(file, options);
            }

            // Upload to server
            const formData = new FormData();
            formData.append('image', fileToUpload, fileToUpload.name);
            
            const response = await fetch(`${SERVER_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload thất bại!');
            
            const result = await response.json();
            
            // Remove uploading message
            $('.messages-container .message').last().remove();
            
            // Send image message
            const message = {
                type: 'image',
                content: result.url
            };

            socket.emit('chat:message', message);

        } catch (error) {
            console.error('Error uploading image:', error);
            $('.messages-container .message').last().remove();
            showAlert('Đã có lỗi xảy ra khi gửi ảnh.');
        } finally {
            event.target.value = '';
        }
    }

    function processMessageQueue() {
        if (messageQueue.length === 0) return;

        messageQueue.forEach(msg => {
            if (socket && isConnected) {
                socket.emit('chat:message', msg);
            }
        });

        messageQueue = [];
    }

    function markMessagesRead(messageIds) {
        const $ = window.jQuery;
        messageIds.forEach(id => {
            const el = $(`.messages-container .message[data-id="${id}"] .read-status`);
            if (el.length) {
                el.text('Đã xem').show();
            }
        });
    }

    function incrementUnreadCount() {
        const $ = window.jQuery;
        const unreadEl = $('#unread-count');
        const current = parseInt(unreadEl.text()) || 0;
        unreadEl.text(current + 1).show();
    }

    function updateConnectionStatus(status) {
        const $ = window.jQuery;
        $('#connection-status').text(status);
    }

    function scrollToBottom() {
        const $ = window.jQuery;
        const container = $('.messages-container');
        container.scrollTop(container[0].scrollHeight);
    }

    function showAlert(message) {
        // Simple alert - can be enhanced with better UI
        alert(message);
    }

    function showNotification(message) {
        // Browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Tin nhắn mới từ Admin', {
                body: message.type === 'image' ? 'Đã gửi hình ảnh' : message.content,
                icon: '/favicon.ico'
            });
            
            setTimeout(() => notification.close(), 5000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Request notification permission on load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

})();