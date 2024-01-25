const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        unique: [true, "Product name should be unique"],
        maxLenght: [40, "Product length should not exceed 40 characters"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        validate: {
            validator: function () {
                return this.price > 0
            },
            message: 'Price should be greater than 0'
        },

    },
    categories: {
        required: true,
        type: [String]
    },
    images: [String],
    averageRating: Number,
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price
            },
            message: "discount should not be greater than price"
        }
    }
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;