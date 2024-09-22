const Car = require('../models/carModel'); // Adjust the path as needed
const Variant = require('../models/variantModel');
const VehicleModel = require('../models/vehicleModel');
const Attribute = require('../models/attributeModel');
const path = require('path');
const fs = require('fs');
const Category = require('../models/categoryModel');
const SERVER_IP = '192.168.31.82';
const PORT = 5000;
const generateCssId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit number
    return `CSS${randomDigits}`; // Concatenates the prefix "CSS" with the 4-digit number
};

// Create a new car
exports.createCar = async (req, res) => {
    try {
        const { brand_id, category_id, name, description, status } = req.body;

        // Generate a random CSS ID
        const css_id = generateCssId();
        console.log('CSS ID:', css_id);

        // Process uploaded files
        const imageFiles = req.files ? req.files.map(file => file.filename) : [];

        // Store relative paths correctly
        const imagePaths = imageFiles.map(filename => filename);

        const newCar = new Car({
            brand_id,
            category_id,
            name,
            description,
            image: imagePaths, // Store filenames directly
            css_id,
            status
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }
        // Find brands based on the filter (either all or filtered by status)
        const cars = await Car.find(filter).populate('brand_id').populate('category_id');
        const carsWithFullImagePath = cars.map(car => {
            if (Array.isArray(car.image)) {
                car.image = car.image.map(img => `http://${SERVER_IP}:${PORT}/uploads/${img}`);
            } else if (car.image) {
                car.image = [`http://${SERVER_IP}:${PORT}/uploads/${car.image}`];
            }
            return car;
        });

        res.json(carsWithFullImagePath);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('brand_id').populate('category_id');
        if (car) {
            // Construct image URLs if the image field is an array
            if (Array.isArray(car.image)) {
                car.image = car.image.map(img => `http://${SERVER_IP}:${PORT}/uploads/${img}`);
            } else if (car.image) {
                car.image = [`http://${SERVER_IP}:${PORT}/uploads/${car.image}`];
            }

            // res.json(car);
        }
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a car by ID
exports.updateCarById = async (req, res) => {
    try {
        const { brand_id, category_id, name, description, css_id, status } = req.body;

        // Check if multiple images are uploaded
        const images = req.files ? req.files.map(file => file.filename) : null;

        // Create an object to hold the updated fields
        const updatedData = {
            brand_id,
            category_id,
            name,
            description,
            css_id,
            status
        };

        // Only update the image field if new images are uploaded
        if (images && images.length > 0) {
            updatedData.image = images;
        }

        // Update the car in the database
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car updated successfully', car });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a car by ID
exports.deleteCarById = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteImage = async (req, res) => {
    const { filename } = req.query; // Read filename from req.query for DELETE requests

    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ message: 'Invalid filename' });
    }

    const filePath = path.resolve('uploads', filename);
    console.log('File path:', filePath);

    try {
        // Delete the image file from the folder
        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: `Error deleting file: ${err.message}` });
            }

            try {
                // Remove the image reference from the database
                await Car.updateMany(
                    { 'image': filename }, // Adjust the query based on your schema
                    { $pull: { image: filename } }
                );

                res.status(200).json({ message: 'File deleted successfully' });
            } catch (dbErr) {
                res.status(500).json({ message: `Error updating database: ${dbErr.message}` });
            }
        });
    } catch (error) {
        res.status(500).json({ message: `Unexpected error: ${error.message}` });
    }
};
exports.getCarsByCategoryId = async (req, res) => {
    try {
        const { category_id } = req.params;
        // Find all cars that have this category_id
        const cars = await Car.find({ category_id })
            .populate('brand_id')
            .populate('category_id');
        const carsWithFullImagePath = cars.map(car => {
            if (Array.isArray(car.image)) {
                car.image = car.image.map(img => `http://${SERVER_IP}:${PORT}/uploads/${img}`);
            } else if (car.image) {
                car.image = [`http://${SERVER_IP}:${PORT}/uploads/${car.image}`];
            }
            return car;
        });

        res.json(carsWithFullImagePath);
        // if (cars.length === 0) {
        //     return res.status(404).json({ message: 'No cars found for this category' });
        // }

        // res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
    }
};
exports.getCarsByBrandId = async (req, res) => {
    try {
        const { brand_id } = req.params;
        // Find all cars that have this category_id
        const cars = await Car.find({ brand_id })
            .populate('brand_id')
            .populate('category_id');
        const carsWithFullImagePath = cars.map(car => {
            if (Array.isArray(car.image)) {
                car.image = car.image.map(img => `http://${SERVER_IP}:${PORT}/uploads/${img}`);
            } else if (car.image) {
                car.image = [`http://${SERVER_IP}:${PORT}/uploads/${car.image}`];
            }
            return car;
        });

        res.json(carsWithFullImagePath);
        // if (cars.length === 0) {
        //     return res.status(404).json({ message: 'No cars found for this category' });
        // }

        // res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
    }
};
exports.getCarsDetailsById = async (req, res) => {
    try {
        const _id = req.params;

        // Fetch the car and related details
        const car = await Car.findOne({ _id, status: 'Active' })
            .populate({
                path: 'brand_id',
                select: 'name',
                match: { status: 'Active' } // Only populate if the brand is active
            })
            .populate({
                path: 'category_id',
                select: 'name',
                match: { status: 'Active' } // Only populate if the category is active
            });

        console.log(car, 'car....');



        if (Array.isArray(car.image)) {
            car.image = car.image.map(img => `http://${SERVER_IP}:${PORT}/uploads/${img}`);
        } else if (car.image) {
            car.image = [`http://${SERVER_IP}:${PORT}/uploads/${car.image}`];
        }

        const variants = await Variant.find({ car_id: _id, status: 'Active' })
            .select('name description status');
        console.log(variants, 'variants.....')


        let variantDetails = await Promise.all(variants.map(async (variant) => {
            const vehicleModel = await VehicleModel.findOne({ variant_id: variant._id })
                .select('price name');

            const attributes = await Attribute.find({ variant_id: variant._id })
                .select('attribute_type attribute_value');

            const fuelType = attributes.find(attr => attr.attribute_type === 'fuel_types');

            const colorOptions = attributes
                .filter(attr => attr.attribute_type === 'Color')
                .map(attr => attr.attribute_value);

            const transmissionOptions = attributes
                .filter(attr => attr.attribute_type === 'Transmission')
                .map(attr => attr.attribute_value);
            return {
                variant,
                vehicleModel,
                fuelType: fuelType ? fuelType.attribute_value : null,
                colorOptions,
                transmissionOptions
            };
        }));

        res.status(200).json({ car, variants: variantDetails });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCarCount = async (req, res) => {
    try {
        // Get status from the request query if provided
        const { status } = req.query;

        // Create a filter object
        let filter = {};
        if (status) {
            filter.status = status; // Apply status filter if provided
        }

        // Count the number of brands based on the filter
        const count = await Car.countDocuments(filter);

        // Send the response with the count
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};