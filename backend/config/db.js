const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration with environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maysecret_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection validation function
const validateConnection = async () => {
  try {
    console.log('🔍 Validating MySQL database connection...');
    
    // Test connection with a simple query
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    
    if (rows && rows[0] && rows[0].test === 1) {
      console.log('✅ MySQL Connected Successfully');
      console.log(`📊 Database: ${dbConfig.database}`);
      console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ MySQL Connection Failed');
    
    // Handle specific error types
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Authentication failed: Invalid username or password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`📁 Database '${dbConfig.database}' does not exist`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Connection refused: MySQL service may not be running');
    } else if (error.code === 'ENOTFOUND') {
      console.error(`🌐 Host '${dbConfig.host}' not found: Network error`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏰ Connection timeout: Server may be unreachable');
    } else {
      console.error('💥 Unknown database error:', error.message);
    }
    
    console.error('🔧 Please check your database configuration in .env file');
    return false;
  }
};

// Health check function for API
const healthCheck = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    return { 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    };
  }
};

// Graceful shutdown function
const closePool = async () => {
  try {
    await pool.end();
    console.log('🔌 Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  validateConnection,
  healthCheck,
  closePool,
  dbConfig
};
