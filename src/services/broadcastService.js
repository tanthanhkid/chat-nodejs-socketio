// Service xử lý logic broadcast đơn giản
const { pool } = require('../config/database');
const ExternalApiService = require('./externalApiService');
const { getOrCreateChannel, addMessage } = require('./dbService');

class BroadcastService {
    constructor(io) {
        this.io = io; // Thêm io instance
    }

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

    // Gửi broadcast message - SỬA PHƯƠNG THỨC NÀY
    async sendBroadcastMessage(messageData) {
        const { content, type, targetType, targetDepartmentId } = messageData;
        
        try {
            // 1. Lấy danh sách nhân viên cần gửi
            let employees;
            if (targetType === 'all_employees') {
                employees = await BroadcastService.getEmployees();
            } else {
                employees = await BroadcastService.getEmployees(targetDepartmentId);
            }

            if (employees.length === 0) {
                throw new Error('Không có nhân viên nào để gửi tin nhắn');
            }

            console.log(`📢 Broadcasting to ${employees.length} employees`);

            // 2. Gửi cho tất cả employees
            const results = [];
            
            for (const employee of employees) {
                const username = employee.username;
                
                try {
                    // Tạo hoặc lấy channel
                    const channel = await getOrCreateChannel(username);

                    // Tạo message data
                    const messageData = {
                        channelId: channel.channel_id,
                        sender: 'admin',
                        type: type,
                        content: content,
                        timestamp: new Date().toISOString()
                        // user_read_at = NULL (mặc định) = unread
                    };

                    // Lưu vào database
                    const savedMessage = await addMessage(messageData);

                    // Bắn vào socket cho username này
                    this.io.to(username).emit('chat:message', savedMessage);

                    results.push({
                        username,
                        messageId: savedMessage.message_id,
                        saved: true,
                        socketSent: true
                    });

                    console.log(`✅ Sent to ${username} (saved to DB + socket broadcast)`);

                } catch (error) {
                    console.error(`❌ Error sending to ${username}:`, error);
                    results.push({
                        username,
                        error: error.message,
                        saved: false,
                        socketSent: false
                    });
                }
            }

            // 3. Tổng hợp kết quả
            const totalSent = results.length;
            const successCount = results.filter(r => r.saved).length;
            const failedCount = results.filter(r => !r.saved).length;

            return {
                success: true,
                message: `Đã gửi tin nhắn tới ${totalSent} nhân viên (${successCount} thành công, ${failedCount} thất bại)`,
                sentCount: totalSent,
                successCount,
                failedCount,
                results: results
            };

        } catch (error) {
            console.error('Error sending broadcast:', error);
            throw error;
        }
    }

    // BỎ PHƯƠNG THỨC getBroadcastHistory() - Không cần nữa

    // BỎ PHƯƠNG THỨC getBroadcastStats() - Không cần nữa
}

module.exports = BroadcastService;
