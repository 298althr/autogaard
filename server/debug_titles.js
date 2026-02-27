const { pool } = require('./config/database');

async function checkActualData() {
    const res = await pool.query('SELECT title, category FROM workshop_services');
    console.log('--- ACTUAL TITLES IN DB ---');
    res.rows.forEach(r => console.log(`[${r.category}] ${r.title}`));
    await pool.end();
}
checkActualData();
