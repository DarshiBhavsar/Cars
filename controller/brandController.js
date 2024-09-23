const Brand = require('../models/brandModel');
const SERVER_IP = '192.168.31.82';
const PORT = 5000;
const BASE_URL = 'https://automotive-1.onrender.com';
exports.createBrand = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const image = req.file ? req.file.filename : null;
        console.log('Request Body:', req.body);
        console.log('Uploaded Image Path:', image);
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }
        const newBrand = new Brand({ name, description, image, status });
        await newBrand.save();
        if (newBrand.image) {
            // newBrand.image = `http://${SERVER_IP}:${PORT}/uploads/${newBrand.image}`;
            newBrand.image = `${BASE_URL}/uploads/${newBrand.image}`;
        }
        console.log('New Brand Created:', newBrand);
        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        console.error('Error creating brand:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllBrands = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Find brands based on the filter (either all or filtered by status)
        const brands = await Brand.find(filter);

        // Map over the brands to add the full image path
        const brandsWithFullImagePath = brands.map(brand => {
            if (brand.image) {
                // Construct the full image path using your SERVER_IP and PORT
                // brand.image = `http://${SERVER_IP}:${PORT}/uploads/${brand.image}`;
                brand.image = `${BASE_URL}/uploads/${brand.image}`;
            }
            return brand;
        });

        // Send the response with the filtered and modified brand data
        res.status(200).json(brandsWithFullImagePath);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all brands
// exports.getAllBrands = async (req, res) => {
//     try {
//         const brands = await Brand.find();
//         res.status(200).json(brands);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        if (brand.image) {
            // Construct the full image path using your SERVER_IP and port
            // brand.image = `http://${SERVER_IP}:${PORT}/uploads/${brand.image}`;
            brand.image = `${BASE_URL}/uploads/${brand.image}`;
        }
        // Send the response with the modified brand data
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a brand by ID
// exports.getBrandById = async (req, res) => {
//     try {
//         const brand = await Brand.findById(req.params.id);
//         if (!brand) {
//             return res.status(404).json({ message: 'Brand not found' });
//         }
//         return brand;
//         res.status(200).json(brand);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// Update a brand by ID
exports.updateBrandById = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const image = req.file ? req.file.filename : null; // Get the image path from the request

        // Update brand with the provided fields, and conditionally update the image
        const updatedData = {
            name,
            description,
            status
        };

        // Only include the image field if a new image is uploaded
        if (image) {
            updatedData.image = image;
        }

        // Use findByIdAndUpdate to update the brand
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.status(200).json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a brand by ID
exports.deleteBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully', brand });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Count the total number of brands
exports.getBrandCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await Brand.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

