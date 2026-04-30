const { pool } = require('./config/database');

async function normalize() {
    console.log('🚀 Starting Database Normalization...');

    try {
        // 1. Deduplicate Brands
        console.log('--- Cleaning Brands ---');
        // Delete duplicates based on name, keeping the first ctid
        await pool.query(`
            DELETE FROM brands 
            WHERE ctid NOT IN (
                SELECT MIN(ctid) 
                FROM brands 
                GROUP BY name
            )
        `);
        console.log('✅ Brands deduplicated by name.');

        // 2. Add Constraints to Brands
        console.log('--- Hardening Brands Schema ---');
        // Check if ID is unique now
        const brandDupIds = await pool.query('SELECT id, COUNT(*) FROM brands GROUP BY id HAVING COUNT(*) > 1');
        if (brandDupIds.rows.length > 0) {
            console.log('⚠️ Duplicate IDs found in brands. Re-assigning IDs...');
            await pool.query(`
                CREATE TEMP TABLE brands_temp AS SELECT * FROM brands;
                TRUNCATE brands;
                INSERT INTO brands (name, url_hash, url, logo, created_at, updated_at)
                SELECT name, url_hash, url, logo, created_at, updated_at FROM brands_temp;
            `);
        }
        
        // Try to add primary key and unique constraint
        await pool.query('ALTER TABLE brands ADD PRIMARY KEY (id)');
        await pool.query('ALTER TABLE brands ADD CONSTRAINT brands_name_unique UNIQUE (name)');
        console.log('✅ Brands schema hardened.');

        // 3. Deduplicate Automobiles
        console.log('--- Cleaning Automobiles ---');
        await pool.query(`
            DELETE FROM automobiles 
            WHERE ctid NOT IN (
                SELECT MIN(ctid) 
                FROM automobiles 
                GROUP BY name, brand_id
            )
        `);
        console.log('✅ Automobiles deduplicated.');

        // 4. Add Constraints to Automobiles
        console.log('--- Hardening Automobiles Schema ---');
        await pool.query('ALTER TABLE automobiles ADD PRIMARY KEY (id)');
        await pool.query('ALTER TABLE automobiles ADD CONSTRAINT automobiles_name_brand_unique UNIQUE (name, brand_id)');
        await pool.query('ALTER TABLE automobiles ADD CONSTRAINT automobiles_brand_fk FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE');
        console.log('✅ Automobiles schema hardened.');

        // 5. Deduplicate Engines
        console.log('--- Cleaning Engines ---');
        await pool.query(`
            DELETE FROM engines 
            WHERE ctid NOT IN (
                SELECT MIN(ctid) 
                FROM engines 
                GROUP BY name, automobile_id
            )
        `);
        console.log('✅ Engines deduplicated.');

        // 6. Add Constraints to Engines
        console.log('--- Hardening Engines Schema ---');
        await pool.query('ALTER TABLE engines ADD PRIMARY KEY (id)');
        await pool.query('ALTER TABLE engines ADD CONSTRAINT engines_name_auto_unique UNIQUE (name, automobile_id)');
        await pool.query('ALTER TABLE engines ADD CONSTRAINT engines_auto_fk FOREIGN KEY (automobile_id) REFERENCES automobiles(id) ON DELETE CASCADE');
        console.log('✅ Engines schema hardened.');

        console.log('🌟 Database Normalization & Hardening Complete!');
    } catch (err) {
        console.error('❌ Normalization failed:', err.message);
        console.error(err.stack);
    } finally {
        await pool.end();
        process.exit();
    }
}

normalize();
