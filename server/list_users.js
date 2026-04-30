const { query } = require('./config/database');

async function checkUsers() {
    try {
        const users = await query('SELECT id, email, role, display_name FROM users');
        console.log('Users in DB:', JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error fetching users:', err);
    } finally {
        process.exit();
    }
}

checkUsers();
