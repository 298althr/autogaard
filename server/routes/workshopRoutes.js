const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { protect } = require('../middleware/authMiddleware');

/**
 * AutoGaard Workshop Routes
 * Proprietary 14-Step Automotive Service Management
 */

// Discovery
router.get('/services', workshopController.getServiceCategories);
router.get('/services/:serviceId/partners', protect, workshopController.getPartners);

// Lifecycle Management
router.post('/request', protect, workshopController.requestService);
router.post('/requests/:requestId/quote', protect, workshopController.submitQuote);
router.post('/requests/:requestId/accept', protect, workshopController.acceptQuote);
router.patch('/requests/:requestId/status', protect, workshopController.updateStatus);

// Audit & History
router.get('/requests/:requestId/timeline', protect, workshopController.getTimeline);

module.exports = router;
