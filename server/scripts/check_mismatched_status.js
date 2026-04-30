const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`
            SELECT v.id, c.make, c.model, v.year, v.status
            FROM vehicles v
            JOIN vehicle_catalog c ON v.catalog_id = c.id
            WHERE v.status = 'in_auction' AND v.id NOT IN (SELECT vehicle_id FROM auctions)
        `);
        console.log('Vehicles marked in_auction but no auction entry:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
