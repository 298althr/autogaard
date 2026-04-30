const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function createAdmin() {
    const client = await pool.connect();
    try {
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminResult = await client.query(`
            INSERT INTO users (email, password_hash, display_name, role, wallet_balance, kyc_status)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO UPDATE SET role = 'admin', password_hash = $2
            RETURNING id
        `, ['admin@Autogaard.com', adminPassword, 'Super Admin', 'admin', 1000000, 'verified']);
        
        console.log('Admin created/updated:', adminResult.rows[0]);
    } catch (err) {
        console.error('Failed to create admin:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

createAdmin();
