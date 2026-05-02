const express = require('express');
const { getTimeOffRequests, getTimeOffRequestsByStaff, createTimeOffRequest, updateTimeOffRequest, deleteTimeOffRequest } = require('../controllers/timeOffController');
const router = express.Router();

router.get('/', getTimeOffRequests);
router.get('/staff/:staffId', getTimeOffRequestsByStaff);
router.post('/', createTimeOffRequest);
router.put('/:id', updateTimeOffRequest);
router.delete('/:id', deleteTimeOffRequest);

module.exports = router;