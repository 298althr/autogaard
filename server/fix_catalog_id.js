const { pool } = require('./config/database');

async function fixCatalogId() {
    const client = await pool.connect();
    try {
        console.log('--- Fixing Catalog ID Sequence ---');
        
        // Ensure id is serial
        await client.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'vehicle_catalog_id_seq') THEN
                    CREATE SEQUENCE vehicle_catalog_id_seq;
                    ALTER TABLE vehicle_catalog ALTER COLUMN id SET DEFAULT nextval('vehicle_catalog_id_seq');
                    ALTER SEQUENCE vehicle_catalog_id_seq OWNED BY vehicle_catalog.id;
                    SELECT setval('vehicle_catalog_id_seq', COALESCE((SELECT MAX(id) FROM vehicle_catalog), 0) + 1);
                END IF;
            END $$;
        `);

        console.log('✅ Catalog ID fixed');
    } catch (err) {
        console.error('❌ Error fixing ID:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

fixCatalogId();
