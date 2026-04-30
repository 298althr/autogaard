const { query } = require('../config/database');
const telegramService = require('../services/telegramService');

const VALID_LEAD_TYPES = [
    'contact', 'buy', 'sell', 'inspection', 'paperwork', 
    'technology', 'restoration', 'logistics', 'valuation', 
    'comparison', 'vehicle_inquiry', 'waitlist'
];

/**
 * Controller to handle lead submissions from various forms
 */
const createLead = async (req, res) => {
    try {
        const { type } = req.params;
        const bodyData = req.body;

        if (!VALID_LEAD_TYPES.includes(type)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid lead type: ${type}` 
            });
        }

        const tableName = `leads_${type}`;
        
        // Fetch valid columns for this table to prevent insertion errors
        const columnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1
        `;
        const columnRes = await query(columnQuery, [tableName]);
        const validColumns = columnRes.rows.map(r => r.column_name);

        // Filter incoming data to only include columns that exist in the table
        const leadData = {};
        Object.keys(bodyData).forEach(key => {
            if (validColumns.includes(key)) {
                let value = bodyData[key];
                // Convert empty strings to null for better DB compatibility
                if (value === '') value = null;
                leadData[key] = value;
            }
        });

        const keys = Object.keys(leadData);
        if (keys.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No valid data provided for this lead type' 
            });
        }

        const columns = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(leadData);

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await query(sql, values);

        // Send Telegram notification in background (original data for complete context)
        telegramService.notifyNewLead(tableName, bodyData).catch(err => {
            console.error('Failed to send Telegram notification:', err.message);
        });

        res.status(201).json({
            success: true,
            message: 'Lead submitted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('LeadController Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            error: error.message
        });
    }
};

module.exports = {
    createLead
};
