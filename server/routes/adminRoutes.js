const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { upload, csvUpload } = require('../services/uploadService');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.post('/kyc/status', adminController.updateKYCStatus);
router.get('/audit-logs', adminController.getAuditLogs);

// Lead Management
router.get('/leads/:type', adminController.getLeads);
router.patch('/leads/:type/:id', adminController.updateLead);
router.delete('/leads/:type/:id', adminController.deleteLead);
router.get('/leads/:type/export', adminController.exportLeads);
router.get('/leads/:type/template', adminController.getTemplate);
router.post('/leads/:type/import', csvUpload.single('file'), adminController.importLeads);

module.exports = router;
