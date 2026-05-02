const express = require('express');
const { getRoles, createRole, updateRole, deleteRole } = require('../controllers/rolesController');
const router = express.Router();

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
