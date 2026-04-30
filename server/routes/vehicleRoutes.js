const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getVehicles);
router.get('/catalog', vehicleController.getCatalog);
router.get('/catalog/:slug', vehicleController.getVehicleBySlug);

module.exports = router;
