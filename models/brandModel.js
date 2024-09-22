const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    }
},
    { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
