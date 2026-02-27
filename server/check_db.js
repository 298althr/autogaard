const { pool } = require('./config/database');

async function check() {
    try {
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'users'::regclass;
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
check();
