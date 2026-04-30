const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const vehicleId = '7c97f9c0-5ec7-4dcc-90af-25ea4f56c8ad';
        const res = await pool.query(`UPDATE vehicles SET status = 'available' WHERE id = $1 RETURNING id, status`, [vehicleId]);
        console.log('✅ Vehicle status reset to available:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('❌ Error fixing vehicle status:', err.message);
    } finally {
        await pool.end();
    }
}
main();
