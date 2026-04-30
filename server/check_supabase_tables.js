const { query } = require('./config/database');

async function checkTables() {
    try {
        const res = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'leads_%'");
        console.log('Tables found:', res.rows.map(row => row.table_name));
    } catch (err) {
        console.error('Error checking tables:', err.message);
    }
    process.exit();
}

checkTables();
