/**
 * Garage Controller
 * Handlers for personal collections and virtual showrooms.
 */

const garageService = require('./garage.service');

/**
 * Get user's personal garage and collections
 */
async function getMyGarage(req, res) {
    try {
        const userId = req.user.id;
        const data = await garageService.getGarageOverview(userId);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

/**
 * Create a new collection (Showroom)
 */
async function createShowroom(req, res) {
    try {
        const userId = req.user.id;
        const { name, description, isPublic } = req.body;
        const collection = await garageService.createCollection(userId, name, description, isPublic);
        res.status(201).json({ status: 'success', data: collection });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

/**
 * Add a vehicle to a showroom
 */
async function addToShowroom(req, res) {
    try {
        const { collectionId, vehicleId } = req.body;
        // In production, verify collection belongs to user
        await garageService.addToCollection(collectionId, vehicleId);
        res.status(200).json({ status: 'success', message: 'Vehicle added to showroom' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

/**
 * Get showroom details
 */
async function getShowroom(req, res) {
    try {
        const { id } = req.params;
        const showroom = await garageService.getCollectionDetails(id);
        res.status(200).json({ status: 'success', data: showroom });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
}

module.exports = {
    getMyGarage,
    createShowroom,
    addToShowroom,
    getShowroom
};
