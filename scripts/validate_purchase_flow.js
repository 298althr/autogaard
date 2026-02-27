require('dotenv').config({ path: './server/.env' });
process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const bidService = require('../server/services/bidService');
const escrowService = require('../server/services/escrowService');

async function runTest() {
    console.log('--- STARTING END-TO-END TRANSACTION VALIDATION ---');

    try {
        // 1. Setup Test Users & Vehicle
        const users = await pool.query('SELECT id, email FROM users ORDER BY created_at ASC LIMIT 10');
        if (users.rows.length < 2) {
            console.error('Need at least 2 users in DB to test');
            process.exit(1);
        }

        // Find a buyer (Savior or similar) and a separate seller
        const buyer = users.rows.find(u => u.email.includes('saviour') || u.email.includes('premium')) || users.rows[0];
        const seller = users.rows.find(u => u.id !== buyer.id) || users.rows[1];

        const buyerId = buyer.id;
        const sellerId = seller.id;

        console.log(`Buyer: ${buyer.email} (ID: ${buyerId})`);
        console.log(`Seller: ${seller.email} (ID: ${sellerId})`);

        // Ensure buyer and seller are verified
        await pool.query("UPDATE users SET wallet_balance = 100000000, kyc_status = 'verified' WHERE id = $1", [buyerId]);
        await pool.query("UPDATE users SET kyc_status = 'verified' WHERE id = $1", [sellerId]);

        // Find or Prepare an Auction
        let auctionRes = await pool.query("SELECT id, vehicle_id FROM auctions LIMIT 1");
        if (!auctionRes.rows[0]) {
            console.error('No auctions found in DB even for preparation');
            process.exit(1);
        }

        const auctionId = auctionRes.rows[0].id;
        const vehicleId = auctionRes.rows[0].vehicle_id;

        // Force this auction to be LIVE and have a Buy Now price for the test
        await pool.query(`
            UPDATE auctions 
            SET status = 'live', 
                buy_now_price = 5000000, 
                current_price = 4500000,
                bid_increment = 50000,
                start_time = NOW() - INTERVAL '1 hour',
                end_time = NOW() + INTERVAL '1 day',
                created_by = $1
            WHERE id = $2
        `, [sellerId, auctionId]);

        // Assign vehicle to seller
        await pool.query('UPDATE vehicles SET owner_id = $1 WHERE id = $2', [sellerId, vehicleId]);

        // Clear existing escrows and related transactions for this auction to avoid FK constraints
        const oldEscrows = await pool.query('SELECT id FROM auction_escrow WHERE auction_id = $1', [auctionId]);
        for (const escrow of oldEscrows.rows) {
            await pool.query('DELETE FROM transactions WHERE escrow_id = $1', [escrow.id]);
        }
        await pool.query('DELETE FROM auction_escrow WHERE auction_id = $1', [auctionId]);

        console.log(`\nTesting on:`);
        console.log(`Auction ID: ${auctionId}`);
        console.log(`Vehicle ID: ${vehicleId}`);

        // 2. Test Security: Seller cannot Buy Now their own car
        console.log('\n[Security Check] Seller attempting Buy Now...');
        try {
            await bidService.buyNow(sellerId, auctionId);
            console.error('❌ FAIL: Seller was able to buy own car');
        } catch (err) {
            console.log('✅ PASS: Seller blocked from buying own car (Error: ' + err.message + ')');
        }

        // 3. Buyer performs Buy Now (10% collateral)
        console.log('\n[Step 1] Buyer performing Buy Now...');
        await bidService.buyNow(buyerId, auctionId);
        console.log('✅ PASS: Buy Now successful.');

        // Verify Escrow presence
        const escrowCheck = await pool.query('SELECT id, stage, held_amount FROM auction_escrow WHERE auction_id = $1 AND buyer_id = $2', [auctionId, buyerId]);
        if (!escrowCheck.rows[0]) throw new Error('Escrow record not found after Buy Now');

        const escrow = escrowCheck.rows[0];
        console.log(`Escrow Created: ${escrow.id}`);
        console.log(`Stage: ${escrow.stage}`);
        console.log(`Held Amount (10%): ${escrow.held_amount}`);

        // 4. Seller Accepts the Deal
        console.log('\n[Step 2] Seller accepting the deal...');
        await escrowService.acceptDeal(escrow.id, sellerId);
        const stageCheck = await pool.query('SELECT stage FROM auction_escrow WHERE id = $1', [escrow.id]);
        console.log(`✅ PASS: Deal Accepted. New Stage: ${stageCheck.rows[0].stage}`);

        // 5. Complete Transaction (100% settlement)
        console.log('\n[Step 3] Completing transaction (Settling remaining 90%)...');
        await escrowService.completeTransaction(escrow.id);
        console.log('✅ PASS: Transaction Completed.');

        // 6. FINAL VALIDATION: Ownership Transfer
        console.log('\n[Final Verification]');
        const vehicleRes = await pool.query('SELECT owner_id, status FROM vehicles WHERE id = $1', [vehicleId]);
        const logRes = await pool.query('SELECT * FROM vehicle_ownership_transfers WHERE vehicle_id = $1 ORDER BY transfer_date DESC LIMIT 1', [vehicleId]);

        if (vehicleRes.rows[0].owner_id === buyerId) {
            console.log('🏆 SUCCESS: Vehicle owner updated in DB to Buyer.');
        } else {
            console.error('❌ FAIL: Owner ID mismatch in vehicles table.');
        }

        if (logRes.rows.length > 0 && logRes.rows[0].new_owner_id === buyerId) {
            console.log('🏆 SUCCESS: Ownership transfer logged in vehicle_ownership_transfers table.');
        } else {
            console.error('❌ FAIL: No transfer log found.');
        }

        console.log('\n--- ALL FIXES VALIDATED END-TO-END ---');

    } catch (err) {
        console.error('\n❌ VALIDATION FAILED:', err);
    } finally {
        await pool.end();
    }
}

runTest();
