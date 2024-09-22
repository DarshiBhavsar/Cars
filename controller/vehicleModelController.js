const VehicleModel = require('../models/vehicleModel');

// Create a new VehicleModel
exports.createVehicleModel = async (req, res) => {
    try {
        const { variant_id, name, price, status } = req.body;

        const newVehicleModel = new VehicleModel({
            variant_id,
            name,
            price,
            status
        });

        await newVehicleModel.save();

        res.status(201).json({ message: 'VehicleModel created successfully', vehicleModel: newVehicleModel });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all VehicleModels
exports.getAllVehicleModels = async (req, res) => {
    try {
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }
        const vehicleModels = await VehicleModel.find(filter).populate('variant_id');
        res.status(200).json(vehicleModels);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a VehicleModel by ID
exports.getVehicleModelById = async (req, res) => {
    try {
        const vehicleModel = await VehicleModel.findById(req.params.id).populate('variant_id');
        if (!vehicleModel) {
            return res.status(404).json({ message: 'VehicleModel not found' });
        }
        res.status(200).json(vehicleModel);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a VehicleModel by ID
exports.updateVehicleModelById = async (req, res) => {
    try {
        const { variant_id, name, price, status } = req.body;
        const vehicleModel = await VehicleModel.findByIdAndUpdate(
            req.params.id,
            { variant_id, name, price, status },
            { new: true }
        );
        if (!vehicleModel) {
            return res.status(404).json({ message: 'VehicleModel not found' });
        }
        res.status(200).json({ message: 'VehicleModel updated successfully', vehicleModel });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a VehicleModel by ID
exports.deleteVehicleModelById = async (req, res) => {
    try {
        const vehicleModel = await VehicleModel.findByIdAndDelete(req.params.id);
        if (!vehicleModel) {
            return res.status(404).json({ message: 'VehicleModel not found' });
        }
        res.status(200).json({ message: 'VehicleModel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getVehicleCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await VehicleModel.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
