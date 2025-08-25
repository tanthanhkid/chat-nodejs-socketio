const { pool } = require('../config/database');

/**
 * Khởi tạo database (kiểm tra kết nối)
 */
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Kiểm tra xem các bảng đã tồn tại chưa
    const channelsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'channels'
      );
    `);
    
    const messagesCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
      );
    `);
    
    if (!channelsCheck.rows[0].exists || !messagesCheck.rows[0].exists) {
      console.warn('⚠️  Database tables not found. Please run the init.sql script first.');
      console.log('💡 Run: docker-compose up -d to initialize database');
    } else {
      console.log('✅ Database tables verified successfully');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

/**
 * Lấy tất cả các kênh chat
 * @returns {Array} Danh sách các kênh
 */
async function getAllChannels() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        c.*,
        COUNT(m.id) as message_count,
        MAX(m.timestamp) as last_message_time
      FROM channels c
      LEFT JOIN messages m ON c.channel_id = m.channel_id
      GROUP BY c.id, c.channel_id, c.user_email, c.created_at
      ORDER BY last_message_time DESC NULLS LAST, c.created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all channels:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Đánh dấu tin nhắn đã đọc
 * @param {string} channelId - ID của kênh
 * @param {'user'|'admin'} reader - Bên đọc
 * @param {string[]} messageIds - Danh sách ID tin nhắn
 */
async function markMessagesRead(channelId, reader, messageIds = []) {
  if (!messageIds.length) return 0;
  const client = await pool.connect();
  try {
    const field = reader === 'user' ? 'user_read_at' : 'admin_read_at';
    const sender = reader === 'user' ? 'admin' : 'user';
    const result = await client.query(
      `UPDATE messages
       SET ${field} = NOW()
       WHERE channel_id = $1 AND sender = $2 AND message_id = ANY($3::uuid[])`,
      [channelId, sender, messageIds]
    );
    return result.rowCount;
  } catch (error) {
    console.error('Error marking messages read:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Lấy tất cả channels kèm tin nhắn cuối cùng đầy đủ (cho admin dashboard)
 * @returns {Array} Danh sách channels với lastMessage đầy đủ
 */
async function getAllChannelsWithLastMessage() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      WITH last_messages AS (
        SELECT DISTINCT ON (channel_id) 
          channel_id,
          message_id,
          sender,
          type,
          content,
          timestamp
        FROM messages 
        ORDER BY channel_id, timestamp DESC
      ),
      unread_counts AS (
        SELECT 
          channel_id,
          COUNT(*) as unread_count
        FROM messages 
        WHERE sender = 'user' AND admin_read_at IS NULL
        GROUP BY channel_id
      )
      SELECT 
        c.id,
        c.channel_id,
        c.user_email, 
        c.created_at,
        COUNT(m.id) as message_count,
        COALESCE(uc.unread_count, 0) as unread_count,
        CASE 
          WHEN lm.message_id IS NOT NULL THEN 
            json_build_object(
              'messageId', lm.message_id,
              'sender', lm.sender,
              'type', lm.type,
              'content', lm.content,
              'timestamp', lm.timestamp
            )
          ELSE NULL 
        END as last_message
      FROM channels c
      LEFT JOIN messages m ON c.channel_id = m.channel_id
      LEFT JOIN last_messages lm ON c.channel_id = lm.channel_id
      LEFT JOIN unread_counts uc ON c.channel_id = uc.channel_id
      GROUP BY c.id, c.channel_id, c.user_email, c.created_at, lm.message_id, lm.sender, lm.type, lm.content, lm.timestamp, uc.unread_count
      ORDER BY lm.timestamp DESC NULLS LAST, c.created_at DESC
    `);
    
    // Convert snake_case to camelCase for frontend compatibility
    const channels = result.rows.map(row => ({
      id: row.id,
      channelId: row.channel_id,
      userEmail: row.user_email,
      createdAt: row.created_at,
      messageCount: row.message_count,
      unreadCount: parseInt(row.unread_count) || 0,
      lastMessage: row.last_message
    }));
    
    return channels;
  } catch (error) {
    console.error('Error getting channels with last message:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Đếm số tin nhắn chưa đọc của admin cho một channel
 * @param {string} channelId - ID của kênh
 * @returns {number} Số tin nhắn chưa đọc
 */
async function getUnreadCountForAdmin(channelId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COUNT(*) as unread_count
       FROM messages 
       WHERE channel_id = $1 AND sender = 'user' AND admin_read_at IS NULL`,
      [channelId]
    );
    
    return parseInt(result.rows[0].unread_count) || 0;
  } catch (error) {
    console.error('Error getting unread count:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Lấy hoặc tạo kênh chat cho user
 * @param {string} email - Email của user
 * @returns {Object} Thông tin kênh
 */
async function getOrCreateChannel(email) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Kiểm tra kênh đã tồn tại
    let result = await client.query(
      'SELECT * FROM channels WHERE user_email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Tạo kênh mới
      result = await client.query(
        'INSERT INTO channels (channel_id, user_email, created_at) VALUES ($1, $2, NOW()) RETURNING *',
        [email, email]
      );
      console.log(`✅ Created new channel for user: ${email}`);
    }
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error getting or creating channel:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Lấy tin nhắn của một kênh
 * @param {string} channelId - ID của kênh
 * @returns {Array} Danh sách tin nhắn
 */
async function getMessages(channelId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT
        message_id as "messageId",
        channel_id as "channelId",
        sender,
        type,
        content,
        timestamp,
        admin_read_at as "adminReadAt",
        user_read_at as "userReadAt"
      FROM messages
      WHERE channel_id = $1
      ORDER BY timestamp ASC`,
      [channelId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting messages:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Thêm tin nhắn mới
 * @param {Object} messageData - Dữ liệu tin nhắn
 * @returns {Object} Tin nhắn đã được lưu
 */
async function addMessage(messageData) {
  const client = await pool.connect();
  try {
    const { channelId, sender, type, content, timestamp } = messageData;
    
    const result = await client.query(
      `INSERT INTO messages (channel_id, sender, type, content, timestamp)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
         message_id as "messageId",
         channel_id as "channelId",
         sender,
         type,
         content,
         timestamp,
         admin_read_at as "adminReadAt",
         user_read_at as "userReadAt"`,
      [
        channelId,
        sender,
        type,
        content,
        timestamp || new Date()
      ]
    );
    
    const savedMessage = result.rows[0];
    console.log(`✅ Message saved: ${savedMessage.messageId} in channel ${channelId}`);
    
    return savedMessage;
  } catch (error) {
    console.error('Error adding message:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Lấy thống kê tổng quan
 * @returns {Object} Thống kê hệ thống
 */
async function getSystemStats() {
  const client = await pool.connect();
  try {
    const channelCount = await client.query('SELECT COUNT(*) as count FROM channels');
    const messageCount = await client.query('SELECT COUNT(*) as count FROM messages');
    const todayMessages = await client.query(
      `SELECT COUNT(*) as count FROM messages 
       WHERE DATE(timestamp) = CURRENT_DATE`
    );
    
    return {
      totalChannels: parseInt(channelCount.rows[0].count),
      totalMessages: parseInt(messageCount.rows[0].count),
      todayMessages: parseInt(todayMessages.rows[0].count)
    };
  } catch (error) {
    console.error('Error getting system stats:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Đánh dấu tất cả tin nhắn của admin là đã đọc bởi user
 * @param {string} channelId - ID của kênh
 * @param {string} userId - ID của user
 * @returns {number} Số tin nhắn đã được đánh dấu
 */
async function markAllMessagesAsReadByUser(channelId, userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE messages
       SET user_read_at = NOW()
       WHERE channel_id = $1 AND sender = 'admin' AND user_read_at IS NULL`,
      [channelId]
    );
    
    console.log(`✅ Marked ${result.rowCount} admin messages as read by user ${userId}`);
    return result.rowCount;
  } catch (error) {
    console.error('Error marking messages read by user:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Đánh dấu tất cả tin nhắn của user là đã đọc bởi admin
 * @param {string} channelId - ID của kênh
 * @param {string} adminId - ID của admin
 * @returns {number} Số tin nhắn đã được đánh dấu
 */
async function markAllMessagesAsReadByAdmin(channelId, adminId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE messages
       SET admin_read_at = NOW()
       WHERE channel_id = $1 AND sender = 'user' AND admin_read_at IS NULL`,
      [channelId]
    );
    
    console.log(`✅ Marked ${result.rowCount} user messages as read by admin ${adminId}`);
    return result.rowCount;
  } catch (error) {
    console.error('Error marking messages read by admin:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Đếm số tin nhắn chưa đọc của user cho một channel
 * @param {string} channelId - ID của kênh
 * @param {string} userId - ID của user
 * @returns {number} Số tin nhắn chưa đọc
 */
async function getUnreadCountForUser(channelId, userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COUNT(*) as unread_count
       FROM messages 
       WHERE channel_id = $1 AND sender = 'admin' AND user_read_at IS NULL`,
      [channelId]
    );
    
    return parseInt(result.rows[0].unread_count) || 0;
  } catch (error) {
    console.error('Error getting unread count for user:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Xóa tin nhắn cũ (cleanup function)
 * @param {number} daysOld - Số ngày cũ
 * @returns {number} Số tin nhắn đã xóa
 */
async function deleteOldMessages(daysOld = 90) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM messages WHERE timestamp < NOW() - ($1 || ' days')::interval",
      [daysOld]
    );
    
    console.log(`🧹 Deleted ${result.rowCount} old messages (older than ${daysOld} days)`);
    return result.rowCount;
  } catch (error) {
    console.error('Error deleting old messages:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  initializeDatabase,
  getAllChannels,
  getAllChannelsWithLastMessage,
  getOrCreateChannel,
  getMessages,
  addMessage,
  markMessagesRead,
  markAllMessagesAsReadByUser,
  markAllMessagesAsReadByAdmin,
  getUnreadCountForUser,
  getSystemStats,
  deleteOldMessages,
  getUnreadCountForAdmin
};