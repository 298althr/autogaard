const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
    const client = await pool.connect();
    try {
        const email = '298saviour@gmail.com';
        const password = 'Amlasawole123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log(`🚀 Creating admin user: ${email}...`);
        
        const userId = uuidv4();
        console.log(`Generated UUID: ${userId}`);
        
        // Safer approach: Delete if exists, then insert
        await client.query('DELETE FROM users WHERE email = $1', [email]);
        
        const result = await client.query(`
            INSERT INTO users (id, email, password_hash, display_name, role, wallet_balance, kyc_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, email, role
        `, [userId, email, hashedPassword, 'Saviour Admin', 'admin', 1000000, 'verified']);
        
        console.log('✅ Admin created/updated successfully:', result.rows[0]);
    } catch (err) {
        console.error('❌ Failed to create admin:', err.message);
    } finally {
        client.release();
        await pool.end();
        process.exit();
    }
}

createAdmin();
