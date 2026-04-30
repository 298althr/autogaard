const axios = require('axios');

/**
 * Service to handle Telegram notifications for new leads
 */
class TelegramService {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.enabled = !!(this.botToken && this.chatId);
        
        if (!this.enabled) {
            console.warn('TelegramService: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in .env. Notifications disabled.');
        }
    }

    /**
     * Send a formatted message to the Telegram chat
     * @param {string} message 
     */
    async sendMessage(message) {
        if (!this.enabled) return;

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            await axios.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });
        } catch (error) {
            console.error('TelegramService Error:', error.response?.data || error.message);
        }
    }

    /**
     * Send a notification for a new lead
     * @param {string} type - Table name or lead type
     * @param {Object} data - Lead data
     */
    async notifyNewLead(type, data) {
        const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' });
        
        let message = `<b>🚀 NEW LEAD RECEIVED</b>\n`;
        message += `<b>Type:</b> ${type.replace('leads_', '').toUpperCase()}\n`;
        message += `<b>Time:</b> ${timestamp} (Lagos)\n`;
        message += `--------------------------\n`;
        
        // Format object keys for better readability
        for (const [key, value] of Object.entries(data)) {
            if (key === 'status' || key === 'id' || key === 'created_at') continue;
            const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            message += `<b>${label}:</b> ${value || 'N/A'}\n`;
        }
        
        message += `--------------------------\n`;
        message += `<i>Check the admin dashboard for details.</i>`;

        await this.sendMessage(message);
    }
}

module.exports = new TelegramService();
