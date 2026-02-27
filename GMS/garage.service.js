/**
 * Garage Service
 * Implements the User-to-User collection management and virtual showrooms.
 * Allows users to organize their portfolio of acquired or watched vehicles.
 */

const { query } = require('../../config/database');

/**
 * Get User's Garage Overview
 * Returns vehicles owned by the user plus their custom collections.
 */
async function getGarageOverview(userId) {
    // 1. Get owned vehicles from vehicles table
    const ownedVehicles = await query(
        `SELECT id, make, model, year, status, primary_image_url, current_value 
         FROM vehicles 
         WHERE owner_id = $1 AND deleted_at IS NULL`,
        [userId]
    );

    // 2. Get custom collections
    const collections = await query(
        `SELECT id, name, description, is_public, created_at 
         FROM user_collections 
         WHERE user_id = $1`,
        [userId]
    );

    return {
        stats: {
            total_owned: ownedVehicles.rows.length,
            portfolio_value: ownedVehicles.rows.reduce((sum, v) => sum + parseFloat(v.current_value || 0), 0)
        },
        inventory: ownedVehicles.rows,
        collections: collections.rows
    };
}

/**
 * Create a new virtual collection (Showroom)
 */
async function createCollection(userId, name, description, isPublic = false) {
    const result = await query(
        `INSERT INTO user_collections (user_id, name, description, is_public)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, name, description, isPublic]
    );
    return result.rows[0];
}

/**
 * Add a vehicle to a collection
 */
async function addToCollection(collectionId, vehicleId) {
    try {
        await query(
            `INSERT INTO collection_items (collection_id, vehicle_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [collectionId, vehicleId]
        );
        return true;
    } catch (err) {
        console.error('Add to collection error:', err.message);
        return false;
    }
}

/**
 * Get items from a specific collection (Showroom)
 */
async function getCollectionDetails(collectionId) {
    const details = await query(
        `SELECT c.name, c.description, c.is_public,
                v.id as vehicle_id, v.make, v.model, v.year, v.primary_image_url
         FROM user_collections c
         LEFT JOIN collection_items ci ON ci.collection_id = c.id
         LEFT JOIN vehicles v ON ci.vehicle_id = v.id
         WHERE c.id = $1`,
        [collectionId]
    );

    if (details.rows.length === 0) throw new Error('Collection not found.');

    const showroom = {
        name: details.rows[0].name,
        description: details.rows[0].description,
        is_public: details.rows[0].is_public,
        vehicles: details.rows.filter(r => r.vehicle_id).map(r => ({
            id: r.vehicle_id,
            make: r.make,
            model: r.model,
            year: r.year,
            image: r.primary_image_url
        }))
    };

    return showroom;
}

module.exports = {
    getGarageOverview,
    createCollection,
    addToCollection,
    getCollectionDetails
};
