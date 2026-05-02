const express = require('express');
const { getTenants, createTenant, updateTenant, deleteTenant } = require('../controllers/tenantsController');
const router = express.Router();

router.get('/', getTenants);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

module.exports = router;