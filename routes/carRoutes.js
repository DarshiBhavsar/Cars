const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const carController = require('../controller/carController');

router.delete('/deleteImage', carController.deleteImage);
// Create a new car
router.post('/', upload.array('image'), carController.createCar);

// Get all cars
router.get('/', carController.getAllCars);

router.get('/count', carController.getCarCount);

router.get('/category/:category_id', carController.getCarsByCategoryId);

router.get('/brand/:brand_id', carController.getCarsByBrandId);

router.get('/details/:_id', carController.getCarsDetailsById);

// Get a car by ID
router.get('/:id', carController.getCarById);

// Update a car by ID
router.put('/:id', upload.array('image'), carController.updateCarById);

// Delete a car by ID
router.delete('/:id', carController.deleteCarById);



module.exports = router;
