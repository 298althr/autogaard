const express = require('express');
const router = express.Router();
const conciergeController = require('../controllers/conciergeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/request', protect, conciergeController.submitRequest);
router.get('/my-requests', protect, conciergeController.getMyRequests);

// Admin routes
router.get('/admin/requests', protect, authorize('admin'), conciergeController.getAllRequests);
router.patch('/admin/requests/:id/status', protect, authorize('admin'), conciergeController.updateStatus);

module.exports = router;
