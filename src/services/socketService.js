// src/services/socketService.js
const { getOrCreateChannel, getMessages, addMessage } = require('./storageService');

function initializeSocket(io) {
    const adminNamespace = io.of("/admin"); // Namespace riêng cho admin

    // Main namespace - cho users
    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on('user:join', ({ email }) => {
            if (!email) {
                socket.emit('error', { message: 'Email is required' });
                return;
            }

            try {
                const channel = getOrCreateChannel(email);
                socket.join(channel.channelId);
                socket.userEmail = email;
                
                const messages = getMessages(channel.channelId);
                socket.emit('chat:history', messages);
                
                // Thông báo cho admin có user mới
                adminNamespace.emit('admin:newUser', channel);
                
                console.log(`User ${email} joined channel ${channel.channelId}`);
            } catch (error) {
                console.error('Error joining user:', error);
                socket.emit('error', { message: 'Failed to join chat' });
            }
        });

        socket.on('chat:message', (message) => {
            try {
                if (!socket.userEmail) {
                    socket.emit('error', { message: 'Please join a channel first' });
                    return;
                }

                const messageData = {
                    channelId: socket.userEmail,
                    sender: 'user',
                    type: message.type || 'text',
                    content: message.content,
                    timestamp: new Date().toISOString()
                };

                const savedMessage = addMessage(messageData);
                
                // Gửi cho admin
                adminNamespace.emit('admin:newMessage', savedMessage);
                
                console.log(`Message from ${socket.userEmail}:`, savedMessage);
            } catch (error) {
                console.error('Error handling user message:', error);
                socket.emit('error', { message: 'Failed to send message' });
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

        socket.on('admin:getChannels', () => {
            try {
                const { getChannelWithLastMessage } = require('./storageService');
                const channels = getChannelWithLastMessage();
                socket.emit('admin:channels', channels);
            } catch (error) {
                console.error('Error getting channels:', error);
                socket.emit('error', { message: 'Failed to get channels' });
            }
        });

        socket.on('admin:getMessages', ({ channelId }) => {
            try {
                const messages = getMessages(channelId);
                socket.emit('admin:messages', { channelId, messages });
            } catch (error) {
                console.error('Error getting messages:', error);
                socket.emit('error', { message: 'Failed to get messages' });
            }
        });

        socket.on('chat:message', (message) => {
            try {
                const messageData = {
                    channelId: message.channelId,
                    sender: 'admin',
                    type: message.type || 'text',
                    content: message.content,
                    timestamp: new Date().toISOString()
                };

                const savedMessage = addMessage(messageData);
                
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

        socket.on('disconnect', () => {
            console.log(`Admin disconnected: ${socket.id}`);
        });
    });
}

module.exports = initializeSocket;