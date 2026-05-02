const db = require('../config/db');

// Get all shifts
const getShifts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shifts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new shift
const createShift = async (req, res) => {
  const { id, name, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO shifts (id, name, is_active) VALUES (?, ?, ?)',
      [id, name, isActive !== false]
    );
    res.status(201).json({ id, name, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getShifts, createShift };