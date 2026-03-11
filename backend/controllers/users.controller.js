const { pool } = require('../config/db');

// Create a new user
exports.createUser = async (req, res) => {
  console.log('👤 POST /api/users - Creating new user');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { first_name, last_name, phone } = req.body;
    
    // Validate input
    if (!first_name || !last_name || !phone) {
      console.error('❌ Missing required fields:', { first_name, last_name, phone });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['first_name', 'last_name', 'phone'],
        received: { first_name, last_name, phone }
      });
    }
    
    console.log('🔍 Executing INSERT query for users table...');
    console.log('📝 Query: INSERT INTO users (first_name, last_name, phone) VALUES (?, ?, ?)');
    console.log('📊 Values:', [first_name, last_name, phone]);
    
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, phone) VALUES (?, ?, ?)',
      [first_name, last_name, phone]
    );
    
    console.log('✅ User created successfully!');
    console.log('🆔 Insert ID:', result.insertId);
    console.log('📈 Affected rows:', result.affectedRows);
    
    const responseData = { id: result.insertId, first_name, last_name, phone };
    console.log('📤 Response:', JSON.stringify(responseData, null, 2));
    
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Failed to create user:');
    console.error('💥 MySQL Error:', error.message);
    console.error('📋 Error Code:', error.code);
    console.error('🔢 Error Number:', error.errno);
    console.error('📊 SQL State:', error.sqlState);
    console.error('🔍 Full Error:', error);
    
    res.status(500).json({ 
      error: 'Failed to create user',
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
