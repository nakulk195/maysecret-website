const { pool } = require('../config/db');

// Create a new product
exports.createProduct = async (req, res) => {
  console.log('📦 POST /api/products - Creating new product');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, description, price, image_url } = req.body;
    
    // Validate input
    if (!name || !description || price === undefined || price === null) {
      console.error('❌ Missing required fields:', { name, description, price, image_url });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'description', 'price'],
        received: { name, description, price, image_url }
      });
    }
    
    console.log('🔍 Executing INSERT query for products table...');
    console.log('📝 Query: INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)');
    console.log('📊 Values:', [name, description, price, image_url]);
    
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name, description, price, image_url]
    );
    
    console.log('✅ Product created successfully!');
    console.log('🆔 Insert ID:', result.insertId);
    console.log('📈 Affected rows:', result.affectedRows);
    
    const responseData = { id: result.insertId, name, description, price, image_url };
    console.log('📤 Response:', JSON.stringify(responseData, null, 2));
    
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Failed to create product:');
    console.error('💥 MySQL Error:', error.message);
    console.error('📋 Error Code:', error.code);
    console.error('🔢 Error Number:', error.errno);
    console.error('📊 SQL State:', error.sqlState);
    console.error('🔍 Full Error:', error);
    
    res.status(500).json({ 
      error: 'Failed to create product',
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, price, image_url, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ id: req.params.id, name, description, price, image_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};