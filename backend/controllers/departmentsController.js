const db = require('../config/db');

const mapRowToDepartment = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  isActive: row.is_active === 1
});

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM departments');
    res.json(rows.map(mapRowToDepartment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new department
const createDepartment = async (req, res) => {
  const { name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO departments (name, description, is_active) VALUES (?, ?, ?)',
      [name, description || null, isActive !== false]
    );
    res.status(201).json({ id: result.insertId, name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE departments SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description || null, isActive !== false, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ id: parseInt(id), name, description, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM departments WHERE id = ?', [parseInt(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };