const workshopService = require('../services/workshopService');

/**
 * Controller for Workshop & Proprietary Services
 */
class WorkshopController {

    // Get list of all available service types
    async getServiceCategories(req, res, next) {
        try {
            const services = await workshopService.getServices(req.query.category);
            res.status(200).json({ success: true, data: services });
        } catch (err) {
            next(err);
        }
    }

    // Step 1: User initiates a service request
    async requestService(req, res, next) {
        try {
            const { vehicle_id, service_id, metadata } = req.body;
            // req.user is populated by auth middleware
            const request = await workshopService.createRequest(req.user.id, vehicle_id, service_id, metadata);
            res.status(201).json({ success: true, data: request });
        } catch (err) {
            next(err);
        }
    }

    // Step 2: Get partner candidates
    async getPartners(req, res, next) {
        try {
            const partners = await workshopService.getAvailablePartners(req.params.serviceId);
            res.status(200).json({ success: true, data: partners });
        } catch (err) {
            next(err);
        }
    }

    // Step 4: Partner submits a quote
    async submitQuote(req, res, next) {
        try {
            const { amount, note } = req.body;
            const quote = await workshopService.submitQuote(req.params.requestId, req.user.partner_id, amount, note);
            res.status(201).json({ success: true, data: quote });
        } catch (err) {
            next(err);
        }
    }

    // Step 5: User accepts a quote
    async acceptQuote(req, res, next) {
        try {
            const request = await workshopService.acceptQuote(req.params.requestId, req.body.quote_id, req.user.id);
            res.status(200).json({ success: true, data: request });
        } catch (err) {
            next(err);
        }
    }

    // Workflow Step Updates (Step 6-14)
    async updateStatus(req, res, next) {
        try {
            const { step, label, notes } = req.body;
            const actorType = req.user.role || 'user';

            const request = await workshopService.updateStatus(
                req.params.requestId,
                step,
                label,
                req.user.id,
                actorType,
                notes
            );

            res.status(200).json({ success: true, data: request });
        } catch (err) {
            next(err);
        }
    }

    // Get Audit History
    async getTimeline(req, res, next) {
        try {
            const history = await workshopService.getHistory(req.params.requestId);
            res.status(200).json({ success: true, data: history });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new WorkshopController();
