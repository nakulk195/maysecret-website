const { pool } = require('../config/db');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    const [result] = await pool.query(
      'INSERT INTO addresses (name, phone, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, address, city, state, pincode]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      phone, 
      address, 
      city, 
      state, 
      pincode 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM addresses');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM addresses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
