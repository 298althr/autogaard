const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');

async function testImport() {
    const csvContent = `name,email,phone,subject,message
Test User,test@example.com,08012345678,Import Test,This is a test import.
Another User,another@example.com,08087654321,Verification,Checking if bulk import works.`;

    const tempPath = path.join(__dirname, 'test_import.csv');
    fs.writeFileSync(tempPath, csvContent);

    console.log('🚀 Starting Test Import into leads_contact...');

    try {
        const data = fs.readFileSync(tempPath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1);

        let importedCount = 0;
        for (const row of rows) {
            const values = row.split(',').map(v => v.trim());
            const leadData = {};
            headers.forEach((header, index) => {
                leadData[header] = values[index] || null;
            });

            const keys = Object.keys(leadData);
            const colNames = keys.join(', ');
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const vals = Object.values(leadData);

            await pool.query(`INSERT INTO leads_contact (${colNames}) VALUES (${placeholders})`, vals);
            importedCount++;
        }

        console.log(`✅ Successfully imported ${importedCount} leads.`);
        
        const result = await pool.query('SELECT * FROM leads_contact');
        console.log('Current leads_contact count:', result.rows.length);

    } catch (err) {
        console.error('❌ Import Test Failed:', err.message);
    } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        await pool.end();
        process.exit();
    }
}

testImport();
