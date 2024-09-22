const express = require('express');
const router = express.Router();
const attributeController = require('../controller/attributeController');

// Create a new Attribute
router.post('/', attributeController.createAttribute);

// Get all Attributes
router.get('/', attributeController.getAllAttributes);

router.get('/count', attributeController.getAttributeCount);
// Get an Attribute by ID
router.get('/:id', attributeController.getAttributeById);

// Update an Attribute by ID
router.put('/:id', attributeController.updateAttributeById);

// Delete an Attribute by ID
router.delete('/:id', attributeController.deleteAttributeById);

module.exports = router;
