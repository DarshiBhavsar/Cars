const Attribute = require('../models/attributeModel');

// Create a new Attribute
exports.createAttribute = async (req, res) => {
    try {
        const { variant_id, attribute_type, attribute_value, status } = req.body;

        const newAttribute = new Attribute({
            variant_id,
            attribute_type,
            attribute_value,
            status,
        });

        await newAttribute.save();

        res.status(201).json({ message: 'Attribute created successfully', attribute: newAttribute });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Attributes
exports.getAllAttributes = async (req, res) => {
    try {
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }
        const attributes = await Attribute.find(filter).populate('variant_id');
        res.status(200).json(attributes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get an Attribute by ID
exports.getAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id).populate('variant_id');
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        res.status(200).json(attribute);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an Attribute by ID
exports.updateAttributeById = async (req, res) => {
    try {
        const { variant_id, attribute_type, attribute_value, status } = req.body;
        const attribute = await Attribute.findByIdAndUpdate(
            req.params.id,
            { variant_id, attribute_type, attribute_value, status },
            { new: true }
        );
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        res.status(200).json({ message: 'Attribute updated successfully', attribute });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an Attribute by ID
exports.deleteAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndDelete(req.params.id);
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        res.status(200).json({ message: 'Attribute deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAttributeCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await Attribute.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
