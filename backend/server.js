const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const { pool, validateConnection, healthCheck } = require('./config/db');

// Import routes
const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/orders.routes');
const addressRoutes = require('./routes/addresses.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);

// Debug database route
app.get('/api/debug-db', async (req, res) => {
  console.log('🔍 Database debug requested');
  try {
    const { pool, dbConfig } = require('./config/db');
    
    // Get current database name
    const [dbResult] = await pool.execute('SELECT DATABASE() as current_db');
    const currentDb = dbResult[0].current_db;
    
    // Get list of tables
    const [tablesResult] = await pool.execute('SHOW TABLES');
    const tables = tablesResult.map(row => Object.values(row)[0]);
    
    // Get table structures
    const tableStructures = {};
    for (const table of tables) {
      try {
        const [structure] = await pool.execute(`DESCRIBE ${table}`);
        tableStructures[table] = structure;
      } catch (error) {
        tableStructures[table] = { error: error.message };
      }
    }
    
    res.json({
      database: currentDb,
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      tables: tables,
      structures: tableStructures,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Database debug completed - DB: ${currentDb}, Tables: ${tables.length}`);
    
  } catch (error) {
    console.error('❌ Database debug failed:', error);
    res.status(500).json({
      error: 'Database debug failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced health check endpoint with database status
app.get('/api/health', async (req, res) => {
  console.log(' Health check requested');
  const dbStatus = await healthCheck();
  
  if (dbStatus.status === 'ok') {
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      server: 'running',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      server: 'running',
      port: PORT,
      error: dbStatus.error,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MAY SECRET API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      addresses: '/api/addresses'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/api/health',
      '/api/users',
      '/api/products', 
      '/api/orders',
      '/api/addresses'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(' Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log(' Starting MAY SECRET API Server...');
    console.log(` Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Validate database connection
    const dbConnected = await validateConnection();
    
    if (!dbConnected) {
      console.error(' Database connection failed, but server will continue running...');
      console.error(' Some API endpoints may not work properly');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(` Server successfully started on port ${PORT}`);
      console.log(` Server URL: http://localhost:${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` API documentation: http://localhost:${PORT}/`);
      
      if (dbConnected) {
        console.log(' Server is fully operational with database connectivity');
      } else {
        console.log(' Server is running but database connectivity issues exist');
      }
    });
    
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;