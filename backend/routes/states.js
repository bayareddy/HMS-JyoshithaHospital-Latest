const express = require('express');
const { getStates, createState, updateState, deleteState } = require('../controllers/statesController');
const router = express.Router();

router.get('/', getStates);
router.post('/', createState);
router.put('/:id', updateState);
router.delete('/:id', deleteState);

module.exports = router;
