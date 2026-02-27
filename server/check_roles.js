const { pool } = require('./config/database');

async function check() {
    try {
        const res = await pool.query(`SELECT DISTINCT role FROM users`);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
check();
