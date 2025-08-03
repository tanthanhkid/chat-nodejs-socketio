// src/services/storageService.js
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
    try {
        const fileContent = fs.readFileSync(CHANNELS_PATH, 'utf8');
        if (fileContent.trim() === 'channelId,userEmail,createdAt') {
            return [];
        }
        return parse(fileContent, { columns: true, skip_empty_lines: true });
    } catch (error) {
        console.error('Error reading channels:', error);
        return [];
    }
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
    try {
        const fileContent = fs.readFileSync(MESSAGES_PATH, 'utf8');
        if (fileContent.trim() === 'messageId,channelId,sender,type,content,timestamp') {
            return [];
        }
        const allMessages = parse(fileContent, { columns: true, skip_empty_lines: true });
        return allMessages.filter(msg => msg.channelId === channelId);
    } catch (error) {
        console.error('Error reading messages:', error);
        return [];
    }
}

function addMessage(messageData) {
    const messageRecord = { 
        messageId: require('crypto').randomUUID(), 
        ...messageData,
        timestamp: messageData.timestamp || new Date().toISOString()
    };
    const csvString = stringify([messageRecord], { header: false });
    fs.appendFileSync(MESSAGES_PATH, csvString);
    return messageRecord;
}

function getChannelWithLastMessage() {
    const channels = getAllChannels();
    const channelsWithLastMessage = channels.map(channel => {
        const messages = getMessages(channel.channelId);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        return {
            ...channel,
            lastMessage,
            messageCount: messages.length
        };
    });
    return channelsWithLastMessage.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
}

module.exports = { 
    initializeStorage, 
    getAllChannels, 
    getOrCreateChannel, 
    getMessages, 
    addMessage,
    getChannelWithLastMessage
};