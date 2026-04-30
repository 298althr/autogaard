const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`
            SELECT v.id, c.make, c.model, v.year, a.id as auction_id, a.status as auction_status
            FROM vehicles v
            JOIN vehicle_catalog c ON v.catalog_id = c.id
            LEFT JOIN auctions a ON a.vehicle_id = v.id
            WHERE c.make ILIKE '%Toyota%' AND c.model ILIKE '%Corolla%'
        `);
        console.log('Toyota Corolla Vehicles:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
