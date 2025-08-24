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
