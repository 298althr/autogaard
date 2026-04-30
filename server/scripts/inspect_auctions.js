const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`SELECT * FROM auctions`);
        console.log('Total Auctions:', res.rowCount);
        // Let's just output the IDs and vehicle_ids
        console.log(JSON.stringify(res.rows.map(a => ({ id: a.id, vehicle_id: a.vehicle_id, status: a.status })), null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
