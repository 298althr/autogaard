const { pool } = require('./config/database');

async function listTables() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables:', rows.map(r => r.table_name).join(', '));
    } finally {
        client.release();
        process.exit();
    }
}

listTables();
