const Category = require('../models/categoryModel'); // Adjust the path as needed
const SERVER_IP = '192.168.31.82';
const PORT = 5000;
const BASE_URL = 'https://cars-szio.onrender.com';
// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const image = req.file ? req.file.filename : null;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, description, status, image });
        await newCategory.save();

        if (newCategory.image) {
            newCategory.image = `${BASE_URL}/uploads/${newCategory.image}`;
        }

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error creating Category:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }
        // Find brands based on the filter (either all or filtered by status)
        const categories = await Category.find(filter);
        // Map over the brands to add the full image path
        const categoryWithFullImagePath = categories.map(categories => {
            if (categories.image) {
                // Construct the full image path using your SERVER_IP and port
                categories.image = `${BASE_URL}/uploads/${categories.image}`;
            }
            return categories;
        });
        res.status(200).json(categoryWithFullImagePath);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        if (category.image) {
            // Construct the full image path using your SERVER_IP and port
            category.image = `${BASE_URL}/uploads/${category.image}`;
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const image = req.file ? req.file.filename : null;
        const updatedData = {
            name,
            description,
            status
        };
        if (image) {
            updatedData.image = image;
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );
        // const category = await Category.findByIdAndUpdate(
        //     req.params.id,
        //     { name, description, status },
        //     { new: true }
        // );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getCategoryCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await Category.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
