
const { pool } = require('./server/config/database');

async function checkSchema() {
    try {
        const brands = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'brands'");
        console.log('--- BRANDS ---');
        brands.rows.forEach(c => console.log(c.column_name));

        const autos = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'automobiles'");
        console.log('\n--- AUTOMOBILES ---');
        autos.rows.forEach(c => console.log(c.column_name));

        const engines = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'engines'");
        console.log('\n--- ENGINES ---');
        engines.rows.forEach(c => console.log(c.column_name));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
