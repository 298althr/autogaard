const { pool } = require('../config/database');
const notificationService = require('../services/notificationService');

class AdminController {
    /**
     * Get system-wide stats for the dashboard
     */
    async getDashboardStats(req, res, next) {
        try {
            const userCount = await pool.query('SELECT COUNT(*) FROM users');
            const vehicleCount = await pool.query('SELECT COUNT(*) FROM vehicles');
            const liveAuctions = await pool.query("SELECT COUNT(*) FROM auctions WHERE status = 'live'");
            const totalRevenue = await pool.query("SELECT SUM(amount) FROM transactions WHERE type = 'settlement'");

            res.status(200).json({
                success: true,
                data: {
                    users: parseInt(userCount.rows[0].count),
                    vehicles: parseInt(vehicleCount.rows[0].count),
                    live_auctions: parseInt(liveAuctions.rows[0].count),
                    revenue: parseFloat(totalRevenue.rows[0].sum || 0)
                }
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get list of users with search/filter
     */
    async getUsers(req, res, next) {
        try {
            const result = await pool.query('SELECT id, email, display_name, role, kyc_status, created_at FROM users ORDER BY created_at DESC');
            res.status(200).json({
                success: true,
                data: result.rows
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update KYC status for a user
     */
    async updateKYCStatus(req, res, next) {
        try {
            const { userId, status, reason } = req.body;
            await pool.query(
                'UPDATE users SET kyc_status = $1, updated_at = NOW() WHERE id = $2',
                [status, userId]
            );

            // Log action
            await pool.query(
                'INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
                [req.user.id, 'update_kyc', 'user', userId, JSON.stringify({ status, reason })]
            );

            res.status(200).json({
                success: true,
                message: `User KYC status updated to ${status}`
            });

            // Notify User
            notificationService.createNotification(userId, {
                title: 'KYC Verification Update',
                message: `Your account verification status has been updated to: ${status}.`,
                type: 'account_update',
                link: '/dashboard/profile',
                metadata: { status }
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get audit logs
     */
    async getAuditLogs(req, res, next) {
        try {
            const result = await pool.query(`
                SELECT a.*, u.email as admin_email 
                FROM admin_audit_log a 
                JOIN users u ON a.admin_id = u.id 
                ORDER BY a.created_at DESC 
                LIMIT 100
            `);
            res.status(200).json({
                success: true,
                data: result.rows
            });
        } catch (err) {
            next(err);
        }
    }

    // --- NEW LEAD MANAGEMENT ---

    /**
     * Get leads by type
     */
    async getLeads(req, res, next) {
        try {
            const { type } = req.params;
            const tableName = `leads_${type}`;
            
            // Basic validation to prevent SQL injection
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
            
            // Add lead quality metric on the fly
            const leadsWithQuality = result.rows.map(lead => {
                let quality_score = 20; // Base score
                if (lead.name) quality_score += 20;
                if (lead.phone && lead.phone.length >= 10) quality_score += 20;
                if (lead.location) quality_score += 20;
                if (lead.notes && lead.notes.length > 5) quality_score += 20;
                else if (lead.email) quality_score += 10;
                
                return { ...lead, quality_score };
            });

            res.status(200).json({
                success: true,
                data: leadsWithQuality
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update lead status or details
     */
    async updateLead(req, res, next) {
        try {
            const { type, id } = req.params;
            const updates = req.body;
            const tableName = `leads_${type}`;
            
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            const keys = Object.keys(updates);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const values = Object.values(updates);
            values.push(id);

            const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
            const result = await pool.query(sql, values);

            res.status(200).json({
                success: true,
                data: result.rows[0]
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a lead
     */
    async deleteLead(req, res, next) {
        try {
            const { type, id } = req.params;
            const tableName = `leads_${type}`;
            
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

            res.status(200).json({
                success: true,
                message: 'Lead deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get empty CSV template for a lead type
     */
    async getTemplate(req, res, next) {
        try {
            const { type } = req.params;
            const tableName = `leads_${type}`;
            
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            // Get columns from the table
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position
            `, [tableName]);

            const headers = result.rows
                .map(r => r.column_name)
                .filter(name => !['id', 'created_at', 'updated_at'].includes(name))
                .join(',');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=template_${type}.csv`);
            res.status(200).send(headers);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Export leads to CSV
     */
    async exportLeads(req, res, next) {
        try {
            const { type } = req.params;
            const tableName = `leads_${type}`;
            
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'No leads found to export' });
            }

            const fields = Object.keys(result.rows[0]);
            const csv = [
                fields.join(','), // Header
                ...result.rows.map(row => fields.map(field => `"${String(row[field] || '').replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=leads_${type}_${new Date().toISOString().split('T')[0]}.csv`);
            res.status(200).send(csv);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Import leads from CSV
     */
    async importLeads(req, res, next) {
        try {
            const { type } = req.params;
            const tableName = `leads_${type}`;
            
            const validTypes = ['contact', 'buy', 'sell', 'inspection', 'paperwork', 'technology', 'restoration', 'logistics', 'valuation', 'comparison', 'vehicle_inquiry', 'waitlist', 'service_provider'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ success: false, message: 'Invalid lead type' });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
            }

            const fs = require('fs');
            const data = fs.readFileSync(req.file.path, 'utf8');
            const lines = data.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                return res.status(400).json({ success: false, message: 'CSV file is empty or missing data' });
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const rows = lines.slice(1);

            let importedCount = 0;
            for (const row of rows) {
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
                
                const leadData = {};
                headers.forEach((header, index) => {
                    if (header !== 'id' && header !== 'created_at' && header !== 'updated_at') {
                        leadData[header] = values[index] || null;
                    }
                });

                const keys = Object.keys(leadData);
                const colNames = keys.join(', ');
                const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                const vals = Object.values(leadData);

                await pool.query(`INSERT INTO ${tableName} (${colNames}) VALUES (${placeholders})`, vals);
                importedCount++;
            }

            // Cleanup temp file
            fs.unlinkSync(req.file.path);

            res.status(200).json({
                success: true,
                message: `Successfully imported ${importedCount} leads into ${tableName}`
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AdminController();
