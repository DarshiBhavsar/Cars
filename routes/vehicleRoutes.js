const express = require('express');
const router = express.Router();
const vehicleModelController = require('../controller/vehicleModelController');

// Create a new VehicleModel
router.post('/', vehicleModelController.createVehicleModel);

// Get all VehicleModels
router.get('/', vehicleModelController.getAllVehicleModels);

router.get('/count', vehicleModelController.getVehicleCount);

// Get a VehicleModel by ID
router.get('/:id', vehicleModelController.getVehicleModelById);

// Update a VehicleModel by ID
router.put('/:id', vehicleModelController.updateVehicleModelById);

// Delete a VehicleModel by ID
router.delete('/:id', vehicleModelController.deleteVehicleModelById);

module.exports = router;
