const db = require('../config/db');

const mapRowToRole = (row) => ({
  id: String(row.id),
  name: row.name,
  description: row.description,
  isActive: row.is_active === 1
});

// Get all roles
const getRoles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles');
    res.json(rows.map(mapRowToRole));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new role
const createRole = async (req, res) => {
  const { name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)',
      [name, description, isActive !== false]
    );
    res.status(201).json({ id: String(result.insertId), name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a role
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE roles SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description, isActive !== false, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ id, name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM roles WHERE id = ?', [parseInt(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRoles, createRole, updateRole, deleteRole };
