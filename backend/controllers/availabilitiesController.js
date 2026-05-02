const db = require('../config/db');

// Get all availabilities
const getAvailabilities = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM availabilities');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new availability
const createAvailability = async (req, res) => {
  const { id, name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO availabilities (id, name, description, is_active) VALUES (?, ?, ?, ?)',
      [id, name, description, isActive !== false]
    );
    res.status(201).json({ id, name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAvailabilities, createAvailability };