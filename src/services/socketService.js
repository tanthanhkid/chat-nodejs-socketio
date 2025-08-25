// src/services/socketService.js
const { getOrCreateChannel, getMessages, addMessage, getAllChannelsWithLastMessage, markMessagesRead, markAllMessagesAsReadByUser, markAllMessagesAsReadByAdmin, markAllUnreadMessagesAsReadForChannel, getUnreadCountForAdmin } = require('./dbService');
const BroadcastService = require('./broadcastService');

function initializeSocket(io) {
    const adminNamespace = io.of("/admin"); // Namespace riêng cho admin

    // Main namespace - cho users
    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on('user:join', async ({ email }) => {
            if (!email) {
                socket.emit('error', { message: 'Email is required' });
                return;
            }

            try {
                const channel = await getOrCreateChannel(email);
                socket.join(channel.channel_id);
                socket.userEmail = email;
                
                const messages = await getMessages(channel.channel_id);
                socket.emit('chat:history', messages);
                
                // Thông báo cho admin có user mới
                adminNamespace.emit('admin:newUser', channel);
                
                console.log(`User ${email} joined channel ${channel.channel_id}`);
            } catch (error) {
                console.error('Error joining user:', error);
                socket.emit('error', { message: 'Failed to join chat' });
            }
        });

        socket.on('chat:message', async (message) => {
            try {
                if (!socket.userEmail) {
                    socket.emit('error', { message: 'Email is required' });
                    return;
                }

                const messageData = {
                    channelId: socket.userEmail,
                    sender: 'user',
                    type: message.type || 'text',
                    content: message.content,
                    timestamp: new Date().toISOString()
                };

                const savedMessage = await addMessage(messageData);

                // Gửi lại cho user với ID tin nhắn
                socket.emit('chat:messageSent', savedMessage);

                // Gửi cho admin với thông tin unread count
                const unreadCount = await getUnreadCountForAdmin(socket.userEmail);
                adminNamespace.emit('admin:newMessage', {
                    ...savedMessage,
                    unreadCount
                });

                console.log(`Message from ${socket.userEmail}:`, savedMessage);
            } catch (error) {
                console.error('Error handling user message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('chat:read', async ({ messageIds }) => {
            try {
                if (!socket.userEmail || !Array.isArray(messageIds)) return;
                await markMessagesRead(socket.userEmail, 'user', messageIds);
                adminNamespace.emit('chat:read', {
                    channelId: socket.userEmail,
                    reader: 'user',
                    messageIds
                });
            } catch (error) {
                console.error('Error marking messages read (user):', error);
            }
        });

        socket.on('chat:user_opened_widget', async ({ channelId }) => {
            try {
                if (!socket.userEmail || channelId !== socket.userEmail) return;
                await markAllMessagesAsReadByUser(channelId, socket.userEmail);
                adminNamespace.emit('chat:read_status_updated', {
                    channelId,
                    reader: 'user',
                    timestamp: new Date()
                });
                console.log(`✅ User ${socket.userEmail} opened widget, marked admin messages as read`);
            } catch (error) {
                console.error('Error marking messages read by user:', error);
            }
        });

        socket.on('chat:mark_all_unread', async ({ channelId, reader }) => {
            try {
                if (!socket.userEmail || channelId !== socket.userEmail) return;
                
                const result = await markAllUnreadMessagesAsReadForChannel(channelId, reader);
                
                // Broadcast cho admin
                adminNamespace.emit('chat:all_unread_marked', {
                    channelId,
                    reader,
                    updatedCount: result.updatedCount,
                    messageIds: result.messageIds,
                    timestamp: new Date()
                });
                
                // Confirm cho user
                socket.emit('chat:all_unread_marked', {
                    channelId,
                    reader,
                    updatedCount: result.updatedCount,
                    messageIds: result.messageIds
                });
                
                console.log(`✅ All unread messages marked as read for ${reader} in channel ${channelId}`);
            } catch (error) {
                console.error('Error marking all unread messages:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    // Admin namespace
    adminNamespace.on('connection', (socket) => {
        console.log(`Admin connected: ${socket.id}`);

        socket.on('admin:join', () => {
            socket.emit('admin:connected', { message: 'Connected as admin' });
        });

        socket.on('admin:getChannels', async () => {
            try {
                const channels = await getAllChannelsWithLastMessage();
                socket.emit('admin:channels', channels);
            } catch (error) {
                console.error('Error getting channels:', error);
                socket.emit('error', { message: 'Failed to get channels' });
            }
        });

        socket.on('admin:getMessages', async ({ channelId }) => {
            try {
                const messages = await getMessages(channelId);
                socket.emit('admin:messages', { channelId, messages });
            } catch (error) {
                console.error('Error getting messages:', error);
                socket.emit('error', { message: 'Failed to get messages' });
            }
        });

        socket.on('chat:read', async ({ channelId, messageIds }) => {
            try {
                if (!channelId || !Array.isArray(messageIds)) return;
                await markMessagesRead(channelId, 'admin', messageIds);
                
                // Cập nhật unread count sau khi đọc
                const unreadCount = await getUnreadCountForAdmin(channelId);
                
                io.to(channelId).emit('chat:read', {
                    reader: 'admin',
                    messageIds
                });
                
                adminNamespace.emit('chat:read', {
                    channelId,
                    reader: 'admin',
                    messageIds,
                    unreadCount
                });
            } catch (error) {
                console.error('Error marking messages read (admin):', error);
            }
        });

        socket.on('chat:admin_opened_conversation', async ({ channelId }) => {
            try {
                if (!channelId) return;
                await markAllMessagesAsReadByAdmin(channelId, 'admin');
                
                // Cập nhật unread count sau khi đọc
                const unreadCount = await getUnreadCountForAdmin(channelId);
                
                io.to(channelId).emit('chat:read_status_updated', {
                    channelId,
                    reader: 'admin',
                    timestamp: new Date()
                });
                
                adminNamespace.emit('chat:read_status_updated', {
                    channelId,
                    reader: 'admin',
                    timestamp: new Date(),
                    unreadCount
                });
                
                console.log(`✅ Admin opened conversation ${channelId}, marked user messages as read`);
            } catch (error) {
                console.error('Error marking messages read by admin:', error);
            }
        });

        socket.on('chat:message', async (message) => {
            try {
                const messageData = {
                    channelId: message.channelId,
                    sender: 'admin',
                    type: message.type || 'text',
                    content: message.content,
                    timestamp: new Date().toISOString()
                };

                const savedMessage = await addMessage(messageData);
                
                // Gửi cho user trong channel đó
                io.to(message.channelId).emit('chat:message', savedMessage);
                
                // Gửi lại cho admin để cập nhật UI
                socket.emit('admin:messageSent', savedMessage);
                
                console.log(`Admin message to ${message.channelId}:`, savedMessage);
            } catch (error) {
                console.error('Error handling admin message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

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

        socket.on('disconnect', () => {
            console.log(`Admin disconnected: ${socket.id}`);
        });
    });
}

module.exports = initializeSocket;