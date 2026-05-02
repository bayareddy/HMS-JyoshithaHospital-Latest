const db = require('../config/db');

const mapRowToTenant = (row) => ({
  id: row.id,
  name: row.name,
  location: row.location,
  isActive: row.is_active === 1
});

// Get all tenants
const getTenants = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tenants');
    res.json(rows.map(mapRowToTenant));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new tenant
const createTenant = async (req, res) => {
  const { name, location, isActive } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tenants (name, location, is_active) VALUES (?, ?, ?)',
      [name, location || null, isActive !== false]
    );
    res.status(201).json({ id: result.insertId, name, location, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tenant
const updateTenant = async (req, res) => {
  const { id } = req.params;
  const { name, location, isActive } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE tenants SET name = ?, location = ?, is_active = ? WHERE id = ?',
      [name, location || null, isActive !== false, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ id: parseInt(id), name, location, isActive: isActive !== false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tenant
const deleteTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM tenants WHERE id = ?', [parseInt(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTenants, createTenant, updateTenant, deleteTenant };