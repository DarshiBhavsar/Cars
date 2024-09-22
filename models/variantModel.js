const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VariantSchema = new Schema({
    car_id: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    status: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Variant = mongoose.model('Variant', VariantSchema);
module.exports = Variant;
