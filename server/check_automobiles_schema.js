const { pool } = require('./config/database');

async function checkAutomobilesSchema() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'automobiles'
        `);
        console.log('Automobiles Schema:', rows);
    } finally {
        client.release();
        process.exit();
    }
}

checkAutomobilesSchema();
