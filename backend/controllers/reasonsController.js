const db = require('../config/db');

// Get all reasons
const getReasons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT *, is_active as isActive FROM reasons ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new reason
const createReason = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO reasons (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    const reasonId = result.insertId;
    // Fetch the created reason
    const [rows] = await db.query('SELECT *, is_active as isActive FROM reasons WHERE id = ?', [reasonId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a reason
const updateReason = async (req, res) => {
  const reasonId = parseInt(req.params.id, 10);
  if (isNaN(reasonId)) {
    return res.status(400).json({ error: 'Invalid reason ID' });
  }
  const { name, description, is_active } = req.body;
  try {
    await db.query(
      'UPDATE reasons SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description || null, is_active !== undefined ? is_active : true, reasonId]
    );
    const [rows] = await db.query('SELECT *, is_active as isActive FROM reasons WHERE id = ?', [reasonId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reason not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a reason
const deleteReason = async (req, res) => {
  const reasonId = parseInt(req.params.id, 10);
  if (isNaN(reasonId)) {
    return res.status(400).json({ error: 'Invalid reason ID' });
  }
  try {
    await db.query('DELETE FROM reasons WHERE id = ?', [reasonId]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getReasons, createReason, updateReason, deleteReason };
