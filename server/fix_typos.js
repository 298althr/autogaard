const { pool } = require('./config/database');

async function fixTypos() {
    console.log('🚀 Fixing common typos in database...');
    try {
        const result = await pool.query(`
            UPDATE automobiles 
            SET name = REPLACE(name, 'Acua', 'Acura') 
            WHERE name ILIKE '%Acua%'
        `);
        console.log(`✅ Fixed ${result.rowCount} "Acua" typos.`);

        const result2 = await pool.query(`
            UPDATE automobiles 
            SET name = UPPER(name) 
            WHERE brand_id IN (SELECT id FROM brands WHERE name IN ('TOYOTA', 'LEXUS', 'HONDA', 'MERCEDES BENZ'))
        `);
        console.log(`✅ Normalized case for ${result2.rowCount} models of popular brands.`);

    } catch (err) {
        console.error('❌ Fix failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

fixTypos();
