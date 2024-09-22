const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
    // resetPasswordToken: { type: String },
    // resetPasswordExpires: { type: Date },
})
const User = mongoose.model("User", userSchema)
module.exports = User