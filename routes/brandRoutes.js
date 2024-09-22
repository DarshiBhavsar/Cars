const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig'); // Adjust the path as needed
const brandController = require('../controller/brandController');


// Create a new brand
router.post('/', upload.single('image'), brandController.createBrand);

// Get all brands
router.get('/', brandController.getAllBrands);

router.get('/count', brandController.getBrandCount);

// Get a brand by ID
router.get('/:id', brandController.getBrandById);

// Update a brand by ID
router.put('/:id', upload.single('image'), brandController.updateBrandById);

// Delete a brand by ID
router.delete('/:id', brandController.deleteBrandById);

module.exports = router;
