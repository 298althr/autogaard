const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`SELECT a.id, a.deposit_pct, c.make, c.model, v.year FROM auctions a JOIN vehicles v ON a.vehicle_id = v.id JOIN vehicle_catalog c ON v.catalog_id = c.id WHERE a.deposit_pct = 50.00`);
        console.log('50% deposit auctions:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
