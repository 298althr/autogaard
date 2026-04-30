const express = require('express');
const router = express.Router();

// Stub for notifications
router.get('/', (req, res) => res.json({ data: [] }));
router.get('/unread-count', (req, res) => res.json({ count: 0 }));
router.patch('/:id/read', (req, res) => res.json({ success: true }));

module.exports = router;
