// Admin Dashboard JavaScript
$(document).ready(function() {
    const SERVER_URL = window.location.origin;
    let socket = null;
    let currentChannelId = null;
    let currentChannelEmail = null;

    // Initialize socket connection
    initializeSocket();

    // Event Listeners
    setupEventListeners();

    function initializeSocket() {
        socket = io('/admin');
        
        socket.on('connect', () => {
            console.log('Admin connected to server');
            updateConnectionStatus(true);
            socket.emit('admin:join');
            refreshChannels();
        });

        socket.on('disconnect', () => {
            console.log('Admin disconnected from server');
            updateConnectionStatus(false);
        });

        socket.on('admin:connected', (data) => {
            console.log('Admin authenticated:', data);
            showToast('Kết nối thành công', 'Đã kết nối với server chat', 'success');
        });

        socket.on('admin:channels', (channels) => {
            updateChannelsList(channels);
        });

        socket.on('admin:messages', (data) => {
            if (data.channelId === currentChannelId) {
                displayMessages(data.messages);
            }
        });

        socket.on('admin:newUser', (channel) => {
            console.log('New user joined:', channel);
            refreshChannels();
            showToast('Người dùng mới', `${channel.userEmail} đã bắt đầu chat`, 'info');
        });

        socket.on('admin:newMessage', (message) => {
            console.log('New message received:', message);

            // Update channels list to show new message
            refreshChannels();

            // If this message is for current channel, display it
            if (message.channelId === currentChannelId) {
                appendMessage(message);
                socket.emit('chat:read', { channelId: currentChannelId, messageIds: [message.messageId] });
            } else {
                // Show notification for other channels
                showToast('Tin nhắn mới', `Từ ${message.channelId}: ${getMessagePreview(message)}`, 'info');
            }
        });

        socket.on('admin:messageSent', (message) => {
            console.log('Message sent successfully:', message);
            appendMessage(message);
            refreshChannels();
        });

        socket.on('chat:read', ({ channelId, messageIds, reader }) => {
            if (reader === 'user' && channelId === currentChannelId) {
                markMessagesRead(messageIds);
            }
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            showToast('Lỗi', error.message || 'Có lỗi xảy ra', 'error');
        });
    }

    function setupEventListeners() {
        // Channel selection
        $(document).on('click', '#user-list li', function() {
            const channelId = $(this).data('channel-id');
            const userEmail = $(this).data('user-email');
            selectChannel(channelId, userEmail);
        });

        // Mobile back button
        $('#back-to-users-btn').on('click', function() {
            showUserList();
        });

        // Send message
        $('#send-btn').on('click', sendMessage);
        $('#message-input').on('keypress', function(e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Image upload
        $('#attach-btn').on('click', function() {
            $('#image-upload-input').click();
        });

        $('#image-upload-input').on('change', handleImageUpload);

        // Image modal
        $(document).on('click', '.chat-image', function() {
            const src = $(this).attr('src');
            showImageModal(src);
        });

        // Auto-resize textarea
        $('#message-input').on('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });

        // Window resize handler
        $(window).on('resize', function() {
            if ($(window).width() >= 768) {
                // Desktop/tablet view - show both panels
                $('.admin-container').removeClass('show-chat');
            }
        });
    }

    function updateConnectionStatus(connected) {
        const statusEl = $('#connection-status');
        if (connected) {
            statusEl.removeClass('disconnected')
                   .addClass('connected')
                   .text('Đã kết nối');
        } else {
            statusEl.removeClass('connected')
                   .addClass('disconnected')
                   .text('Mất kết nối');
        }
    }

    function refreshChannels() {
        if (socket && socket.connected) {
            socket.emit('admin:getChannels');
        }
    }

    function updateChannelsList(channels) {
        const userList = $('#user-list');
        
        if (!channels || channels.length === 0) {
            userList.html(`
                <div class="empty-state">
                    <i class="fas fa-comments fa-2x"></i>
                    <p>Chưa có cuộc trò chuyện nào</p>
                </div>
            `);
            return;
        }

        let html = '';
        channels.forEach(channel => {
            const isActive = channel.channelId === currentChannelId ? 'active' : '';
            const lastMessagePreview = getLastMessagePreview(channel.lastMessage);
            const lastMessageTime = channel.lastMessage ? formatDate(channel.lastMessage.timestamp) : '';
            
            html += `
                <li data-channel-id="${channel.channelId}" data-user-email="${escapeHtml(channel.userEmail)}" class="${isActive}">
                    <div class="user-email">${escapeHtml(channel.userEmail)}</div>
                    <div class="last-message">${lastMessagePreview}</div>
                    ${lastMessageTime ? `<div class="message-time">${lastMessageTime}</div>` : ''}
                </li>
            `;
        });
        
        userList.html(html);
    }

    function selectChannel(channelId, userEmail) {
        if (channelId === currentChannelId) {
            // On mobile, still show chat even if same channel
            if ($(window).width() < 768) {
                showChatPanel();
            }
            return;
        }

        currentChannelId = channelId;
        currentChannelEmail = userEmail;

        // Update UI
        $('#user-list li').removeClass('active');
        $(`#user-list li[data-channel-id="${channelId}"]`).addClass('active');

        // Update header
        $('#current-chat-user').text(currentChannelEmail);

        // Enable chat input
        $('#message-input, #send-btn, #attach-btn').prop('disabled', false);

        // Show chat panel on mobile
        if ($(window).width() < 768) {
            showChatPanel();
        }

        // Clear messages and load new ones
        showLoadingMessages();

        // Request messages for this channel
        if (socket && socket.connected) {
            socket.emit('admin:getMessages', { channelId });
        }
    }

    function showUserList() {
        $('.admin-container').removeClass('show-chat');
    }

    function showChatPanel() {
        $('.admin-container').addClass('show-chat');
    }

    function showLoadingMessages() {
        $('#messages-container').html(`
            <div class="chat-empty-state">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p>Đang tải tin nhắn...</p>
            </div>
        `);
    }

    function displayMessages(messages) {
        const chatContainer = $('#messages-container');
        chatContainer.empty();

        if (!messages || messages.length === 0) {
            chatContainer.html(`
                <div class="chat-empty-state">
                    <i class="fas fa-comment-dots"></i>
                    <h3>Bắt đầu cuộc trò chuyện</h3>
                    <p>Chưa có tin nhắn nào trong cuộc trò chuyện này</p>
                </div>
            `);
            return;
        }

        const userIds = [];
        messages.forEach(message => {
            appendMessage(message, false);
            if (message.sender === 'user' && !message.adminReadAt) {
                userIds.push(message.messageId);
            }
        });

        scrollToBottom();
        if (socket && userIds.length) {
            socket.emit('chat:read', { channelId: currentChannelId, messageIds: userIds });
        }
    }

    function appendMessage(message, animate = true) {
        const chatContainer = $('#messages-container');
        
        // Remove empty state if exists
        chatContainer.find('.chat-empty-state').remove();
        
        const messageClass = message.sender === 'admin' ? 'admin-message' : 'user-message';
        const senderName = message.sender === 'admin' ? 'Admin' : currentChannelEmail;
        
        let messageContent = '';
        if (message.type === 'image') {
            messageContent = `<img src="${message.content}" alt="Hình ảnh" class="chat-image">`;
        } else {
            messageContent = `<div class="message-content">${escapeHtml(message.content)}</div>`;
        }

        const readText = message.sender === 'admin' && message.userReadAt ? 'Đã xem' : '';
        const messageHtml = `
            <div class="message ${messageClass}" data-id="${message.messageId}">
                ${messageContent}
                <div class="message-meta">
                    ${senderName} • ${formatTime(message.timestamp)}
                    <span class="read-status"${readText ? '' : ' style="display:none;"'}>${readText}</span>
                </div>
            </div>
        `;

        if (animate) {
            chatContainer.append(messageHtml);
            chatContainer.children().last().hide().fadeIn(300);
        } else {
            chatContainer.append(messageHtml);
        }

        scrollToBottom();
    }

    function markMessagesRead(messageIds) {
        messageIds.forEach(id => {
            const el = $(`#messages-container .message[data-id="${id}"] .read-status`);
            if (el.length) {
                el.text('Đã xem').show();
            }
        });
    }

    function sendMessage() {
        const content = $('#message-input').val().trim();
        if (!content || !currentChannelId || !socket) return;

        const message = {
            channelId: currentChannelId,
            type: 'text',
            content: content
        };

        socket.emit('chat:message', message);
        $('#message-input').val('').css('height', 'auto');
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('Lỗi', 'Kích thước ảnh không được vượt quá 5MB.', 'error');
            return;
        }

        if (!currentChannelId) {
            showToast('Lỗi', 'Vui lòng chọn cuộc trò chuyện trước.', 'error');
            return;
        }

        const loadingToast = showToast('Đang tải lên', 'Đang xử lý hình ảnh...', 'info', false);
        
        // Show uploading message
        const uploadingMessage = {
            sender: 'admin',
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
            $('#messages-container .message').last().remove();
            
            // Send message with image
            const message = {
                channelId: currentChannelId,
                type: 'image',
                content: result.url
            };

            socket.emit('chat:message', message);
            
            loadingToast.hide();
            showToast('Thành công', 'Đã gửi hình ảnh', 'success');

        } catch (error) {
            console.error('Error uploading image:', error);
            $('#messages-container .message').last().remove();
            loadingToast.hide();
            showToast('Lỗi', 'Đã có lỗi xảy ra khi gửi ảnh.', 'error');
        } finally {
            event.target.value = '';
        }
    }

    function scrollToBottom() {
        const chatContainer = $('#messages-container');
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }

    function getLastMessagePreview(lastMessage) {
        if (!lastMessage) return 'Chưa có tin nhắn';
        
        if (lastMessage.type === 'image') {
            return '📷 Hình ảnh';
        }
        
        return lastMessage.content && lastMessage.content.length > 50 
            ? lastMessage.content.substring(0, 50) + '...'
            : lastMessage.content || 'Tin nhắn trống';
    }

    function getMessagePreview(message) {
        if (message.type === 'image') return 'đã gửi hình ảnh';
        return message.content && message.content.length > 50 
            ? message.content.substring(0, 50) + '...'
            : message.content || 'tin nhắn trống';
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { 
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit', 
            minute: '2-digit' 
        });
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

    function showToast(title, message, type = 'info', autoHide = true) {
        // Simple toast implementation - can be enhanced
        const toastClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        const toast = $(`
            <div class="alert ${toastClass} alert-dismissible fade show" role="alert" style="margin-bottom: 10px;">
                <strong>${escapeHtml(title)}</strong> ${escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('#toast-container').append(toast);
        
        if (autoHide) {
            setTimeout(() => {
                toast.alert('close');
            }, 5000);
        }
        
        return {
            hide: () => toast.alert('close')
        };
    }

    function showImageModal(src) {
        const modalHtml = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Xem hình ảnh</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${src}" class="img-fluid" alt="Hình ảnh">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHtml);
        const modal = new bootstrap.Modal('#imageModal');
        modal.show();
        
        $('#imageModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }
});