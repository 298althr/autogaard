/**
 * Garage Routes
 * Defines endpoints for user collections and portfolio management.
 */

const express = require('express');
const router = express.Router();
const garageController = require('./garage.controller');
const { protect } = require('../auth/auth.middleware');

// All garage routes are protected by authentication
router.use(protect);

/**
 * @route GET /api/v1/garage/my-garage
 * @desc Get user's personal vehicle inventory and collections
 */
router.get('/my-garage', garageController.getMyGarage);

/**
 * @route POST /api/v1/garage/collections
 * @desc Create a new virtual showroom
 */
router.post('/collections', garageController.createShowroom);

/**
 * @route POST /api/v1/garage/collections/item
 * @desc Add a vehicle to a showroom
 */
router.post('/collections/item', garageController.addToShowroom);

/**
 * @route GET /api/v1/garage/collections/:id
 * @desc Get details and vehicles within a showroom
 */
router.get('/collections/:id', garageController.getShowroom);

module.exports = router;
