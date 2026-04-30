const { pool } = require('./config/database');

async function deduplicate() {
    console.log('🚀 Starting Deduplication...');

    try {
        // Deduplicate Brands
        console.log('Cleaning Brands...');
        await pool.query(`
            DELETE FROM brands a USING brands b
            WHERE a.id < b.id AND a.name = b.name
        `);

        // Deduplicate Automobiles (based on name and brand_id)
        console.log('Cleaning Automobiles...');
        await pool.query(`
            DELETE FROM automobiles a USING automobiles b
            WHERE a.id < b.id AND a.name = b.name AND a.brand_id = b.brand_id
        `);

        // Deduplicate Engines (based on name and automobile_id)
        console.log('Cleaning Engines...');
        await pool.query(`
            DELETE FROM engines a USING engines b
            WHERE a.id < b.id AND a.name = b.name AND a.automobile_id = b.automobile_id
        `);

        console.log('✅ Deduplication complete!');
    } catch (err) {
        console.error('❌ Deduplication failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

deduplicate();
