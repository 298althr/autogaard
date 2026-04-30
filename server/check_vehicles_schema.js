const { query } = require('./config/database');

async function checkSchema() {
    try {
        const result = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'vehicles'");
        console.log('Vehicles Schema:', JSON.stringify(result.rows, null, 2));
    } catch (err) {
        console.error('Error fetching schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
