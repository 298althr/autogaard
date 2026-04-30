const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { globalLimiter } = require('../middleware/rateLimiter');

// Rate limit lead submissions to prevent spam
router.post('/track-click', leadController.trackClick);
router.post('/:type', globalLimiter, leadController.createLead);

module.exports = router;
