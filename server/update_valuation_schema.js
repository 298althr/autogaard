const { pool } = require('./config/database');

async function updateSchema() {
    console.log('🚀 Updating leads_valuation table schema...');
    try {
        await pool.query(`
            ALTER TABLE leads_valuation 
            ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(255),
            ADD COLUMN IF NOT EXISTS email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS trim VARCHAR(255),
            ADD COLUMN IF NOT EXISTS transmission VARCHAR(255),
            ADD COLUMN IF NOT EXISTS mileage_km INTEGER,
            ADD COLUMN IF NOT EXISTS condition VARCHAR(255),
            ADD COLUMN IF NOT EXISTS accident_history BOOLEAN,
            ADD COLUMN IF NOT EXISTS make VARCHAR(255),
            ADD COLUMN IF NOT EXISTS model VARCHAR(255)
        `);
        console.log('✅ leads_valuation table updated successfully.');
    } catch (err) {
        console.error('❌ Update failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

updateSchema();
