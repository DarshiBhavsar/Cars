const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
    variant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Variant',
        required: true
    },
    attribute_type: {
        type: String,
        required: true
    },
    attribute_value: {
        type: String,
        required: true
    },
    status: {
        type: String
    }
},
    { timestamps: true }
);

const Attribute = mongoose.model('Attribute', AttributeSchema);
module.exports = Attribute;
