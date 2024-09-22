const Variant = require('../models/variantModel');

// Create a new variant
exports.createVariant = async (req, res) => {
    try {
        const { car_id, name, description, status } = req.body;

        const newVariant = new Variant({ car_id, name, description, status });
        await newVariant.save();

        res.status(201).json({ message: 'Variant created successfully', variant: newVariant });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all variants
exports.getAllVariants = async (req, res) => {
    try {
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }
        const variants = await Variant.find(filter).populate('car_id');
        res.status(200).json(variants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a variant by ID
exports.getVariantById = async (req, res) => {
    try {
        const variant = await Variant.findById(req.params.id).populate('car_id');
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        res.status(200).json(variant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a variant by ID
exports.updateVariantById = async (req, res) => {
    try {
        const { car_id, name, description, status } = req.body;
        const variant = await Variant.findByIdAndUpdate(
            req.params.id,
            { car_id, name, description, status },
            { new: true }
        );
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        res.status(200).json({ message: 'Variant updated successfully', variant });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a variant by ID
exports.deleteVariantById = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndDelete(req.params.id);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        res.status(200).json({ message: 'Variant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getVariantCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await Variant.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
