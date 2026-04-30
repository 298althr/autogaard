const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: 'postgresql://postgres:pSqGlclZvUKMLiQXQeiccKYhanHzeRys@yamanote.proxy.rlwy.net:18967/railway'
});

async function main() {
    const migrations = [
        'server/db/migrations/009_vehicle_ownership_logs.sql',
        'server/db/migrations/010_vehicle_registration_docs.sql',
        'server/db/migrations/011_auction_logic_evolution.sql',
        'server/db/migrations/012_escrow_stage_update.sql'
    ];

    for (const mig of migrations) {
        console.log(`🚀 Applying ${mig}...`);
        try {
            const sql = fs.readFileSync(mig, 'utf8');
            // Split by semicolon but be careful with functions/triggers (not used here)
            const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

            for (const statement of statements) {
                console.log(`  Executing: ${statement.substring(0, 50)}...`);
                await pool.query(statement);
            }
            console.log(`✅ ${mig} completed.`);
        } catch (err) {
            console.error(`❌ Error in ${mig}:`, err.message);
            // Don't stop for 'already exists' errors if we use IF NOT EXISTS
        }
    }
    await pool.end();
}

main();
