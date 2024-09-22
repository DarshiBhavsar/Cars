const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: [{ type: String }],
    description: {
        type: String,
        default: null
    },
    css_id: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;
