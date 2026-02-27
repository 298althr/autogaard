const fs = require('fs');
const path = require('path');
const { pool } = require('../../config/database');

async function seed() {
    const seedFile = path.join(__dirname, 'workshop_seeds.sql');
    const sql = fs.readFileSync(seedFile, 'utf8');

    console.log('🌱 Starting Workshop seeding...');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log('✅ Workshop seeding completed!');
    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

seed();
