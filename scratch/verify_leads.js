const fetch = require('node-fetch');

async function test() {
    // 1. Login
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@Autogaard.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log('Login Success, Token obtained.');

    // 2. Prepare CSV
    const fs = require('fs');
    const csvContent = 'name,email,phone,message,status\nJohn Import,john@import.com,08012345678,Test Import Lead,new\nJane CSV,jane@csv.com,09012345678,Another Lead,new';
    fs.writeFileSync('test_import.csv', csvContent);

    // 3. Import via form-data
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream('test_import.csv'));

    const importRes = await fetch('http://localhost:4000/api/admin/leads/contact/import', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            ...form.getHeaders()
        },
        body: form
    });
    const importData = await importRes.json();
    console.log('Import Response:', JSON.stringify(importData, null, 2));

    // 4. Verify Export
    const exportRes = await fetch('http://localhost:4000/api/admin/leads/contact/export', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const exportText = await exportRes.text();
    console.log('Export Preview (first 100 chars):', exportText.substring(0, 100));
}

test();
