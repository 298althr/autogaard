const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        console.log('🚀 Updating live auctions with realistic Buy Now prices...');

        // Update live auctions with a 25% premium over current price, rounded to nearest 50k
        const result = await pool.query(`
            UPDATE auctions 
            SET buy_now_price = ROUND((current_price * 1.25) / 50000) * 50000 
            WHERE (status = 'live' OR status = 'scheduled') AND buy_now_price IS NULL
            RETURNING id, current_price, buy_now_price
        `);

        console.log(`✅ Updated ${result.rowCount} auctions.`);
        result.rows.forEach(row => {
            console.log(`   - Auction ${row.id.slice(0, 8)}: Current: ₦${parseFloat(row.current_price).toLocaleString()} | Buy Now: ₦${parseFloat(row.buy_now_price).toLocaleString()}`);
        });

    } catch (err) {
        console.error('❌ Error updating auctions:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

main();
