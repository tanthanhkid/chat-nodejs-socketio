const { Pool } = require('pg');
require('dotenv').config();

// Cấu hình connection pool cho PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'chatuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'chatapp',
  password: process.env.DB_PASSWORD || 'chatpassword',
  port: process.env.DB_PORT || 5432,
  
  // Connection pool settings
  max: 20,                    // Số connection tối đa trong pool
  min: 2,                     // Số connection tối thiểu luôn mở
  idleTimeoutMillis: 30000,   // Thời gian timeout cho idle connection (30s)
  connectionTimeoutMillis: 2000, // Thời gian timeout khi tạo connection mới (2s)
  acquireTimeoutMillis: 60000,    // Thời gian timeout khi acquire connection (60s)
  
  // SSL configuration (disable for development)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Event listeners cho connection pool
pool.on('connect', (client) => {
  console.log('New client connected to PostgreSQL pool');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('acquire', (client) => {
  console.log('Client acquired from pool');
});

pool.on('release', (client) => {
  console.log('Client released back to pool');
});

// Test connection function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Database time:', result.rows[0].current_time);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown function
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database pool closed successfully');
  } catch (error) {
    console.error('❌ Error closing database pool:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down database connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  testConnection,
  closePool
};