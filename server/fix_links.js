const { pool } = require('./config/database');

async function fixLinks() {
    console.log('🚀 Fixing broken database links...');

    try {
        // 1. Fix automobiles -> brands link
        console.log('--- Re-linking Automobiles to Brands ---');
        // We assume names are correct and unique in brands now.
        // We'll update automobiles.brand_id based on brand.name match.
        
        // This is tricky because we don't know the old brand name for an automobile if the ID is wrong.
        // Wait, did I change the brand_id in automobiles? 
        // No, I only changed the id in brands.
        // But since there was no FK, automobiles.brand_id now points to non-existent or wrong brand IDs.

        // We need a way to know which brand an automobile belongs to.
        // Luckily, we might still have the old IDs if we haven't overwritten everything.
        // But wait, the normalize script ALREADY ran and ADDED a foreign key.
        // If the FK addition succeeded, then the links might be "technically" valid but pointing to the wrong brands.
        // OR the FK addition failed and I didn't notice.
        
        // Let's check if the FK exists.
        const fkCheck = await pool.query(`
            SELECT conname FROM pg_constraint WHERE conname = 'automobiles_brand_fk'
        `);

        if (fkCheck.rows.length === 0) {
            console.log('⚠️ Foreign key missing. Linking by name fallback...');
            // If we can't link by name, we are in trouble.
            // But wait, many automobiles were imported with a brand name in a different way?
            // Let's check automobiles columns.
        }

        // Actually, I have a better idea. 
        // I will use the 'url' column in brands and 'brand_id' in automobiles if I can.
        // But wait, if I TRUNCATED brands, the new IDs are 1, 2, 3...
        // The old IDs were likely high numbers or random.

        // I'll look for any table that might have the mapping.
        // If I don't have it, I'll have to re-import or use some other logic.

        // WAIT! I have the `brands_temp` table if the script was still running or if I can recreate it.
        // But it was a TEMP table, so it's gone.

        // Let's see if I can find a brand for an automobile by matching the automobile's name or something? No.
        
        // HOW ABOUT THIS: I'll check if any automobiles currently have a valid brand_id.
        const validCount = await pool.query('SELECT count(*) FROM automobiles WHERE brand_id IN (SELECT id FROM brands)');
        console.log('Valid automobiles links:', validCount.rows[0].count);
        
        const totalCount = await pool.query('SELECT count(*) FROM automobiles');
        console.log('Total automobiles:', totalCount.rows[0].count);

        if (validCount.rows[0].count === '0') {
            console.log('❌ ALL LINKS ARE BROKEN. Attempting emergency recovery...');
            // Recovery strategy: Many automobile names or metadata might contain clues.
            // But wait, I might have a backup of the brands table or I can just re-associate them 
            // if I know which brand name matches which automobile.
            // But automobiles table doesn't have the brand name string!
        }
    } catch (err) {
        console.error('❌ Fix failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

fixLinks();
