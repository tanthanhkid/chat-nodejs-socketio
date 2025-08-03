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

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            showToast('Lỗi', error.message || 'Có lỗi xảy ra', 'error');
        });
    }

    function setupEventListeners() {
        // Channel selection
        $(document).on('click', '.channel-item', function() {
            const channelId = $(this).data('channel-id');
            selectChannel(channelId);
        });

        // Refresh channels
        $('#refresh-channels').on('click', function() {
            refreshChannels();
        });

        // Send message
        $('#send-btn').on('click', sendMessage);
        $('#message-input').on('keypress', function(e) {
            if (e.which === 13) {
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
    }

    function updateConnectionStatus(connected) {
        const statusEl = $('#connection-status');
        if (connected) {
            statusEl.removeClass('disconnected bg-danger')
                   .addClass('bg-success')
                   .html('<i class="fas fa-circle me-1"></i>Đã kết nối');
        } else {
            statusEl.removeClass('bg-success')
                   .addClass('disconnected bg-danger')
                   .html('<i class="fas fa-exclamation-circle me-1"></i>Mất kết nối');
        }
    }

    function refreshChannels() {
        if (socket && socket.connected) {
            socket.emit('admin:getChannels');
        }
    }

    function updateChannelsList(channels) {
        const channelsContainer = $('#channels-list');
        
        if (!channels || channels.length === 0) {
            channelsContainer.html(`
                <div class="text-center text-muted py-4">
                    <i class="fas fa-comments fa-2x mb-2"></i>
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
                <div class="channel-item p-2 border rounded mb-2 ${isActive}" data-channel-id="${channel.channelId}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="fw-bold text-truncate">${escapeHtml(channel.userEmail)}</div>
                            <small class="text-muted text-truncate d-block">${lastMessagePreview}</small>
                            ${lastMessageTime ? `<small class="text-muted">${lastMessageTime}</small>` : ''}
                        </div>
                        ${channel.messageCount ? `<span class="badge bg-primary">${channel.messageCount}</span>` : ''}
                    </div>
                </div>
            `;
        });
        
        channelsContainer.html(html);
    }

    function selectChannel(channelId) {
        if (channelId === currentChannelId) return;

        currentChannelId = channelId;
        currentChannelEmail = channelId; // channelId is email

        // Update UI
        $('.channel-item').removeClass('active');
        $(`.channel-item[data-channel-id="${channelId}"]`).addClass('active');

        // Update header
        $('#current-user-email').text(currentChannelEmail);
        $('#user-status').text('Đang online');

        // Enable chat input
        $('#message-input, #send-btn, #attach-btn').prop('disabled', false);

        // Clear messages and load new ones
        $('#chat-messages').html('<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>');

        // Request messages for this channel
        if (socket && socket.connected) {
            socket.emit('admin:getMessages', { channelId });
        }
    }

    function displayMessages(messages) {
        const chatContainer = $('#chat-messages');
        chatContainer.empty();

        if (!messages || messages.length === 0) {
            chatContainer.html(`
                <div class="text-center text-muted py-5">
                    <i class="fas fa-comment-dots fa-3x mb-3"></i>
                    <h5>Bắt đầu cuộc trò chuyện</h5>
                    <p>Chưa có tin nhắn nào trong cuộc trò chuyện này</p>
                </div>
            `);
            return;
        }

        messages.forEach(message => {
            appendMessage(message, false);
        });

        scrollToBottom();
    }

    function appendMessage(message, animate = true) {
        const chatContainer = $('#chat-messages');
        const messageClass = message.sender === 'admin' ? 'admin-message' : 'user-message';
        const senderName = message.sender === 'admin' ? 'Admin' : currentChannelEmail;
        
        let messageContent = '';
        if (message.type === 'image') {
            messageContent = `<img src="${message.content}" alt="Hình ảnh" class="chat-image img-fluid">`;
        } else {
            messageContent = escapeHtml(message.content);
        }

        const messageHtml = `
            <div class="message ${messageClass}">
                <div class="message-bubble">
                    ${messageContent}
                </div>
                <div class="message-meta">
                    ${senderName} • ${formatDate(message.timestamp)}
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

    function sendMessage() {
        const content = $('#message-input').val().trim();
        if (!content || !currentChannelId || !socket) return;

        const message = {
            channelId: currentChannelId,
            type: 'text',
            content: content
        };

        socket.emit('chat:message', message);
        $('#message-input').val('');
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

        try {
            // Compress image
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            
            // Upload to server
            const formData = new FormData();
            formData.append('image', compressedFile, compressedFile.name);
            
            const response = await fetch(`${SERVER_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload thất bại!');
            
            const result = await response.json();
            
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
            loadingToast.hide();
            showToast('Lỗi', 'Đã có lỗi xảy ra khi gửi ảnh.', 'error');
        } finally {
            event.target.value = '';
        }
    }

    function scrollToBottom() {
        const chatContainer = $('#chat-messages');
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }

    function getLastMessagePreview(lastMessage) {
        if (!lastMessage) return 'Chưa có tin nhắn';
        
        if (lastMessage.type === 'image') {
            return '<i class="fas fa-image"></i> Hình ảnh';
        }
        
        return lastMessage.content.length > 30 
            ? lastMessage.content.substring(0, 30) + '...'
            : lastMessage.content;
    }

    function getMessagePreview(message) {
        if (message.type === 'image') return 'đã gửi hình ảnh';
        return message.content.length > 50 
            ? message.content.substring(0, 50) + '...'
            : message.content;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(title, message, type = 'info', autoHide = true) {
        const toastId = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 
                       type === 'warning' ? 'bg-warning' : 'bg-info';
        
        const toastHtml = `
            <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white">
                    <strong class="me-auto">${escapeHtml(title)}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${escapeHtml(message)}
                </div>
            </div>
        `;
        
        $('#toast-container').append(toastHtml);
        const toastElement = $(`#${toastId}`);
        const toast = new bootstrap.Toast(toastElement[0], { autohide: autoHide });
        toast.show();
        
        return toast;
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