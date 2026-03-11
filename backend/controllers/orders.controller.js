const { pool } = require('../config/db');

// Create a new order
exports.createOrder = async (req, res) => {
  console.log('🛒 POST /api/orders - Creating new order');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  const connection = await pool.getConnection();
  console.log('🔌 Database connection acquired');
  
  try {
    await connection.beginTransaction();
    console.log('🔄 Transaction started');
    
    const { user_id, total_amount, status = 'pending', items } = req.body;
    
    // Validate input
    if (!user_id || total_amount === undefined || total_amount === null) {
      console.error('❌ Missing required fields:', { user_id, total_amount, status, items });
      await connection.rollback();
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['user_id', 'total_amount'],
        received: { user_id, total_amount, status, items }
      });
    }
    
    console.log('🔍 Executing INSERT query for orders table...');
    console.log('📝 Query: INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)');
    console.log('📊 Values:', [user_id, total_amount, status]);
    
    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [user_id, total_amount, status]
    );
    
    const orderId = orderResult.insertId;
    console.log('✅ Order created successfully!');
    console.log('🆔 Order ID:', orderId);
    console.log('📈 Affected rows:', orderResult.affectedRows);
    
    // Insert order items
    if (items && items.length > 0) {
      console.log('📦 Processing order items:', items.length, 'items');
      
      const orderItems = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);
      
      console.log('🔍 Executing INSERT query for order_items table...');
      console.log('📝 Query: INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?');
      console.log('📊 Values:', orderItems);
      
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
        [orderItems]
      );
      
      console.log('✅ Order items created successfully!');
    } else {
      console.log('⚠️ No items provided for this order');
    }
    
    await connection.commit();
    console.log('✅ Transaction committed successfully');
    
    const responseData = { 
      id: orderId, 
      user_id, 
      total_amount, 
      status,
      items: items || []
    };
    console.log('📤 Response:', JSON.stringify(responseData, null, 2));
    
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Failed to create order:');
    console.error('💥 MySQL Error:', error.message);
    console.error('📋 Error Code:', error.code);
    console.error('🔢 Error Number:', error.errno);
    console.error('📊 SQL State:', error.sqlState);
    console.error('🔍 Full Error:', error);
    
    await connection.rollback();
    console.log('🔄 Transaction rolled back');
    
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  } finally {
    connection.release();
    console.log('🔌 Database connection released');
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders');
    
    // Get order items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    
    order.items = items;
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
