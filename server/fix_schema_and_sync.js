const { pool } = require('./config/database');
const crypto = require('crypto');

async function fixSchemaAndSync() {
    const client = await pool.connect();
    try {
        console.log('--- Fixing Schema and Syncing Data ---');
        
        // Fix Brands ID sequence
        try {
            await client.query(`CREATE SEQUENCE IF NOT EXISTS brands_id_seq`);
            await client.query(`ALTER TABLE brands ALTER COLUMN id SET DEFAULT nextval('brands_id_seq')`);
            await client.query(`ALTER SEQUENCE brands_id_seq OWNED BY brands.id`);
        } catch (e) { console.log('Brands sequence fix note:', e.message); }

        // Fix Automobiles ID sequence
        try {
            await client.query(`CREATE SEQUENCE IF NOT EXISTS automobiles_id_seq`);
            await client.query(`ALTER TABLE automobiles ALTER COLUMN id SET DEFAULT nextval('automobiles_id_seq')`);
            await client.query(`ALTER SEQUENCE automobiles_id_seq OWNED BY automobiles.id`);
        } catch (e) { console.log('Automobiles sequence fix note:', e.message); }

        // Clear existing to normalize
        await client.query('TRUNCATE TABLE automobiles CASCADE');
        await client.query('TRUNCATE TABLE brands CASCADE');

        // Fetch professional brands from catalog
        const { rows: catalogMakes } = await client.query('SELECT DISTINCT make FROM vehicle_catalog ORDER BY make');

        for (const makeRow of catalogMakes) {
            const make = makeRow.make;
            const hash = crypto.createHash('md5').update(make).digest('hex');
            console.log(`Processing ${make}...`);
            
            // Insert brand
            const { rows: brandRows } = await client.query(
                'INSERT INTO brands (name, url_hash, url) VALUES ($1, $2, $3) RETURNING id',
                [make, hash, `/brands/${make.toLowerCase().replace(/\s+/g, '-')}`]
            );
            const brandId = brandRows[0].id;

            // Fetch models for this brand from catalog
            const { rows: catalogModels } = await client.query(
                'SELECT DISTINCT model FROM vehicle_catalog WHERE make = $1',
                [make]
            );

            for (const modelRow of catalogModels) {
                const model = modelRow.model;
                const mHash = crypto.createHash('md5').update(`${make} ${model}`).digest('hex');
                await client.query(
                    'INSERT INTO automobiles (brand_id, name, url_hash, url) VALUES ($1, $2, $3, $4)',
                    [brandId, model, mHash, `/models/${model.toLowerCase().replace(/\s+/g, '-')}`]
                );
            }
        }

        console.log('✅ Schema fixed and Valuation tables synced successfully');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

fixSchemaAndSync();
