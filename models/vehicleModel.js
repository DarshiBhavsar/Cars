const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleModelSchema = new Schema({
    variant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Variant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: null
    },
    status: {
        type: String,
    }
},
    { timestamps: true }
);

const VehicleModel = mongoose.model('VehicleModel', VehicleModelSchema);
module.exports = VehicleModel;
