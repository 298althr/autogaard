const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function main() {
    const migPath = path.join(__dirname, '../db/migrations/013_service_provider_leads.sql');
    console.log(`🚀 Applying ${migPath}...`);
    
    try {
        const sql = fs.readFileSync(migPath, 'utf8');
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (const statement of statements) {
            console.log(`  Executing: ${statement.substring(0, 50)}...`);
            await query(statement);
        }
        console.log(`✅ Migration completed successfully.`);
    } catch (err) {
        console.error(`❌ Migration failed:`, err.message);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
