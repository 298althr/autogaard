const { pool } = require('./config/database');

async function upgradeCatalogSchema() {
    const client = await pool.connect();
    try {
        console.log('--- Upgrading Vehicle Catalog Schema ---');
        
        // Add educational and market data columns
        const queries = [
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}'`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}'`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS common_issues TEXT[] DEFAULT '{}'`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS maintenance_tips TEXT[] DEFAULT '{}'`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS price_range_tokunbo VARCHAR(100)`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS price_range_local VARCHAR(100)`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS engine_options JSONB DEFAULT '[]'`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS reliability_score INTEGER DEFAULT 8`,
            `ALTER TABLE vehicle_catalog ADD COLUMN IF NOT EXISTS parts_availability VARCHAR(50) DEFAULT 'High'`
        ];

        for (const q of queries) {
            await client.query(q);
        }

        console.log('✅ Catalog schema upgraded successfully');

        // Populate some sample data for the top models
        const sampleDataQuery = `
            UPDATE vehicle_catalog 
            SET 
                pros = ARRAY['Fuel efficiency', 'High resale value', 'Rugged suspension', 'Easy to repair'],
                cons = ARRAY['Basic interior in lower trims', 'Common target for theft', 'Dated infotainment'],
                common_issues = ARRAY['Dashboard melting (pre-2012)', 'Steering rack wear'],
                maintenance_tips = ARRAY['Service every 5,000km', 'Use genuine Toyota ATF'],
                price_range_tokunbo = '₦7.5M - ₦12M',
                price_range_local = '₦4.5M - ₦7.5M',
                reliability_score = 9
            WHERE model ILIKE '%Camry%' OR model ILIKE '%Corolla%'
        `;
        await client.query(sampleDataQuery);
        console.log('✅ Sample authority data populated for Toyota models');

    } catch (err) {
        console.error('❌ Error upgrading catalog:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

upgradeCatalogSchema();
