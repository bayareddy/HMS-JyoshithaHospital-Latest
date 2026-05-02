const db = require('../config/db');

// Get all qualifications
const getQualifications = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM qualifications');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new qualification
const createQualification = async (req, res) => {
  const { id, name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO qualifications (id, name, description, is_active) VALUES (?, ?, ?, ?)',
      [id, name, description, isActive !== false]
    );
    res.status(201).json({ id, name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getQualifications, createQualification };