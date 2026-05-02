const express = require('express');
const { getReasons, createReason, updateReason, deleteReason } = require('../controllers/reasonsController');
const router = express.Router();

router.get('/', getReasons);
router.post('/', createReason);
router.put('/:id', updateReason);
router.delete('/:id', deleteReason);

module.exports = router;
