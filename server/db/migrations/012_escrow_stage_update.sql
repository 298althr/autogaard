-- ============================================================
-- SQL Evolution: Escrow Stage Expansion
-- Responsibility: Supporting Seller Verification Loop
-- ============================================================

-- 1. Update auction_escrow stage constraint
ALTER TABLE auction_escrow DROP CONSTRAINT IF EXISTS auction_escrow_stage_check;
ALTER TABLE auction_escrow ADD CONSTRAINT auction_escrow_stage_check 
CHECK (stage IN ('waiting_seller_acceptance', 'commitment_10', 'escrow_70', 'final_100', 'completed', 'refunded'));

-- 2. Update auction status to include seller acceptance phase
ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_status_check;
ALTER TABLE auctions ADD CONSTRAINT auctions_status_check 
CHECK (status IN (
    'draft', 'scheduled', 'live', 'ended', 'settled', 'unsold', 'cancelled',
    'buy_now_locked', 'sold_pending_70', 'sold_pending_validation', 'awaiting_final_payment',
    'pending_seller_acceptance'
));
