const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`
            SELECT v.*, c.make, c.model 
            FROM vehicles v 
            JOIN vehicle_catalog c ON v.catalog_id = c.id 
            WHERE v.year = 2012 AND (c.make ILIKE '%Toyota%' OR c.model ILIKE '%Corolla%')
        `);
        console.log('2012 Toyota Corolla Detail:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
