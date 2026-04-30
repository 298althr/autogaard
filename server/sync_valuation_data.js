const { pool } = require('./config/database');

async function syncValuationTables() {
    const client = await pool.connect();
    try {
        console.log('--- Syncing Valuation Tables (Brands & Automobiles) ---');
        
        // Clear existing to normalize
        await client.query('TRUNCATE TABLE automobiles CASCADE');
        await client.query('TRUNCATE TABLE brands CASCADE');

        // Reset sequences for SERIAL columns if any
        await client.query(`SELECT setval(pg_get_serial_sequence('brands', 'id'), 1, false)`);
        await client.query(`SELECT setval(pg_get_serial_sequence('automobiles', 'id'), 1, false)`);

        // Fetch professional brands from catalog
        const { rows: catalogMakes } = await client.query('SELECT DISTINCT make FROM vehicle_catalog ORDER BY make');

        for (const makeRow of catalogMakes) {
            const make = makeRow.make;
            console.log(`Processing ${make}...`);
            
            // Insert brand
            const { rows: brandRows } = await client.query(
                'INSERT INTO brands (name) VALUES ($1) RETURNING id',
                [make]
            );
            const brandId = brandRows[0].id;

            // Fetch models for this brand from catalog
            const { rows: catalogModels } = await client.query(
                'SELECT DISTINCT model FROM vehicle_catalog WHERE make = $1',
                [make]
            );

            for (const modelRow of catalogModels) {
                const model = modelRow.model;
                await client.query(
                    'INSERT INTO automobiles (brand_id, name) VALUES ($1, $2)',
                    [brandId, model]
                );
            }
        }

        console.log('✅ Valuation tables synced successfully (Brands & Automobiles)');

    } catch (err) {
        console.error('❌ Error syncing valuation tables:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

syncValuationTables();
