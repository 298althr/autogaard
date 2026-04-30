const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const targetVehicleId = '7c97f9c0-5ec7-4dcc-90af-25ea4f56c8ad';
        const res = await pool.query(`SELECT * FROM auctions WHERE vehicle_id = $1`, [targetVehicleId]);
        console.log(`Auctions for Vehicle ${targetVehicleId}:`, JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
