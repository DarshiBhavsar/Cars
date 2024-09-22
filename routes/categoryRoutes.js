const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const upload = require('../middleware/multerConfig');

// Create a new category
router.post('/', upload.single('image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

router.get('/count', categoryController.getCategoryCount);
// Get a category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', upload.single('image'), categoryController.updateCategoryById);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;
