const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    try {
        console.log('🔍 Identifying vehicles with missing VINs...');
        const res = await pool.query("SELECT id FROM vehicles WHERE vin IS NULL");
        console.log(`Found ${res.rowCount} vehicles requiring update.`);

        for (const row of res.rows) {
            const tempVin = `TEMP-VIN-${row.id.substring(0, 8)}`.toUpperCase();
            await pool.query("UPDATE vehicles SET vin = $1 WHERE id = $2", [tempVin, row.id]);
            console.log(`  Updated ${row.id} with VIN ${tempVin}`);
        }

        console.log('✅ VIN sanitization complete.');
    } catch (err) {
        console.error('❌ Error during sanitization:', err.message);
    } finally {
        await pool.end();
    }
}
main();
