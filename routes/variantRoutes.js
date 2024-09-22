const express = require('express');
const router = express.Router();
const variantController = require('../controller/variantController');

// Route to create a new variant
router.post('/', variantController.createVariant);

// Route to get all variants
router.get('/', variantController.getAllVariants);

router.get('/count', variantController.getVariantCount);

// Route to get a variant by ID
router.get('/:id', variantController.getVariantById);

// Route to update a variant by ID
router.put('/:id', variantController.updateVariantById);

// Route to delete a variant by ID
router.delete('/:id', variantController.deleteVariantById);

module.exports = router;
