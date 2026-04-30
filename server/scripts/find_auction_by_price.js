const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        const res = await pool.query(`SELECT * FROM auctions WHERE start_price = 4200000 OR current_price = 4200000`);
        console.log('Auctions by price:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
