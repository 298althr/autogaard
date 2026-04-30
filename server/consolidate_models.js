const { pool } = require('./config/database');

async function consolidate() {
    console.log('🚀 Starting Model Consolidation (Engine-Safe Mode)...');

    try {
        // 1. Case Normalization
        console.log('--- Normalizing Case ---');
        await pool.query("UPDATE brands SET name = UPPER(TRIM(name))");
        await pool.query("UPDATE automobiles SET name = TRIM(name)");
        console.log('✅ Brands and models trimmed.');

        // 2. Fix specific brand overlaps (Mercedes)
        console.log('--- Consolidating Brand Overlaps (Mercedes) ---');
        const targetBrand = await pool.query("SELECT id FROM brands WHERE name = 'MERCEDES BENZ' LIMIT 1");
        const sourceBrand = await pool.query("SELECT id FROM brands WHERE name = 'MERCEDES-AMG' LIMIT 1");

        if (targetBrand.rows.length > 0 && sourceBrand.rows.length > 0) {
            const tId = targetBrand.rows[0].id;
            const sId = sourceBrand.rows[0].id;

            const overlaps = await pool.query(`
                SELECT a.id as source_id, b.id as target_id, a.name 
                FROM automobiles a 
                JOIN automobiles b ON UPPER(a.name) = UPPER(b.name)
                WHERE a.brand_id = $1 AND b.brand_id = $2
            `, [sId, tId]);

            for (const overlap of overlaps.rows) {
                console.log(`🔗 Merging AMG ${overlap.name} into Benz ${overlap.name}...`);
                await mergeEngines(overlap.source_id, overlap.target_id);
                await pool.query('DELETE FROM automobiles WHERE id = $1', [overlap.source_id]);
            }

            await pool.query('UPDATE automobiles SET brand_id = $1 WHERE brand_id = $2', [tId, sId]);
            await pool.query('DELETE FROM brands WHERE id = $1', [sId]);
        }
        console.log('✅ Brand overlaps resolved.');

        // 3. Model Consolidation Logic
        console.log('--- Consolidating Model Variants ---');
        
        const models = await pool.query(`
            SELECT id, name, brand_id 
            FROM automobiles 
            ORDER BY brand_id, LENGTH(name) ASC
        `);

        const brandGroups = {};
        models.rows.forEach(m => {
            if (!brandGroups[m.brand_id]) brandGroups[m.brand_id] = [];
            brandGroups[m.brand_id].push(m);
        });

        for (const brandId in brandGroups) {
            const brandModels = brandGroups[brandId];
            const processedIds = new Set();

            for (const model of brandModels) {
                if (processedIds.has(model.id)) continue;

                const variants = brandModels.filter(v => 
                    v.id !== model.id && 
                    !processedIds.has(v.id) &&
                    (
                        v.name.startsWith(model.name + ' ') || 
                        v.name.startsWith(model.name + ' (') ||
                        v.name.toUpperCase() === model.name.toUpperCase()
                    )
                );

                if (variants.length > 0) {
                    console.log(`📦 Merging ${variants.length} variants into "${model.name}"...`);
                    for (const variant of variants) {
                        await mergeEngines(variant.id, model.id);
                        await pool.query('DELETE FROM automobiles WHERE id = $1', [variant.id]);
                        processedIds.add(variant.id);
                    }
                }
                processedIds.add(model.id);
            }
        }

        console.log('🌟 Model Consolidation Complete!');
    } catch (err) {
        console.error('❌ Consolidation failed:', err.message);
        console.error(err.stack);
    } finally {
        await pool.end();
        process.exit();
    }
}

/**
 * Helper to safely move engines from one automobile to another, handling duplicates
 */
async function mergeEngines(sourceAutoId, targetAutoId) {
    // Identify overlapping engine names
    const overlaps = await pool.query(`
        SELECT a.id as source_id, b.id as target_id, a.name 
        FROM engines a 
        JOIN engines b ON UPPER(a.name) = UPPER(b.name)
        WHERE a.automobile_id = $1 AND b.automobile_id = $2
    `, [sourceAutoId, targetAutoId]);

    for (const overlap of overlaps.rows) {
        // If they overlap, just delete the source engine (or we could merge specs, but keeping the target is safer/cleaner)
        await pool.query('DELETE FROM engines WHERE id = $1', [overlap.source_id]);
    }

    // Move remaining engines
    await pool.query('UPDATE engines SET automobile_id = $1 WHERE automobile_id = $2', [targetAutoId, sourceAutoId]);
}

consolidate();
