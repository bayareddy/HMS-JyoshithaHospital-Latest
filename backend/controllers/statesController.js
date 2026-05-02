const db = require('../config/db');

const mapRowToState = (row) => ({
  id: row.id,
  name: row.name,
  stateCode: row.state_code,
  isActive: row.is_active === 1
});

// Get all states
const getStates = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM states ORDER BY name');
    res.json(rows.map(mapRowToState));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new state
const createState = async (req, res) => {
  const { name, stateCode, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO states (name, state_code, is_active) VALUES (?, ?, ?)',
      [name, stateCode || null, isActive !== false]
    );
    res.status(201).json({ id: result.insertId, name, stateCode, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a state
const updateState = async (req, res) => {
  const { id } = req.params;
  const { name, stateCode, isActive } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE states SET name = ?, state_code = ?, is_active = ? WHERE id = ?',
      [name, stateCode || null, isActive !== false, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'State not found' });
    }
    res.json({ id: parseInt(id), name, stateCode, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a state
const deleteState = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM states WHERE id = ?', [parseInt(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'State not found' });
    }
    res.json({ message: 'State deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStates, createState, updateState, deleteState };
