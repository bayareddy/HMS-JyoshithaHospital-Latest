const express = require('express');
const { getAvailabilities, createAvailability } = require('../controllers/availabilitiesController');
const router = express.Router();

router.get('/', getAvailabilities);
router.post('/', createAvailability);

module.exports = router;