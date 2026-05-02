const express = require('express');
const { getQualifications, createQualification } = require('../controllers/qualificationsController');
const router = express.Router();

router.get('/', getQualifications);
router.post('/', createQualification);

module.exports = router;