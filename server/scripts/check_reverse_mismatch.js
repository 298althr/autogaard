const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`
            SELECT a.id as auction_id, v.id as vehicle_id, v.status as vehicle_status
            FROM auctions a
            JOIN vehicles v ON a.vehicle_id = v.id
            WHERE v.status != 'in_auction'
        `);
        console.log('Auctions with incorrect vehicle status:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
