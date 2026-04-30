const { pool } = require('./config/database');

async function checkBrandsSchema() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'brands'
        `);
        console.log('Brands Schema:', rows);
    } finally {
        client.release();
        process.exit();
    }
}

checkBrandsSchema();
