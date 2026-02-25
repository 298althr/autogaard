const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', auctionController.getAuctions);
router.get('/:id', auctionController.getAuctionById);

router.post('/', protect, authorize('admin'), auctionController.createAuction);
router.post('/:id/bid', protect, auctionController.placeBid);
<<<<<<< HEAD
router.get('/:id/my-bids', protect, auctionController.getMyBids);
=======
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28

module.exports = router;
