const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    confirmPassword: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function () {
                return this.password === this.confirmPassword
            },
            message: "Password and Confirm Password should be same"
        }
    },
    address: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function () {
    this.confirmPassword = undefined;
})

const User = mongoose.model("User", userSchema);

module.exports = User;