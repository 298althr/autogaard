const { pool } = require('./config/database');

async function fixTable() {
    try {
        await pool.query('ALTER TABLE leads_valuation ALTER COLUMN phone DROP NOT NULL');
        console.log('✅ phone column is now nullable.');
    } catch (err) {
        console.error('❌ Fix failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

fixTable();
