const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', blogController.getPosts);
router.get('/:slug', blogController.getPostBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), blogController.createPost);
router.patch('/:id', protect, authorize('admin'), blogController.updatePost);
router.delete('/:id', protect, authorize('admin'), blogController.deletePost);

module.exports = router;
