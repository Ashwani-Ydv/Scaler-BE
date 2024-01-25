const Product = require('../models/productModel')

const checkInput = function (req, res, next) {
    const productDetails = req.body;
    const isEmpty = Object.keys(productDetails).length === 0;
    if (isEmpty) {
        res.status(400).json({
            status: 400,
            message: "Body can not be empty"
        })
    }
    else {
        next();
    }
}
/**handlers */
/** Route handlers */

async function getProductHandler(req, res) {
    try {
        const productData = await Product.find();
        if (productData.length === 0)
            throw new Error("No Product found");
        else {
            msg = 'Data Found'
            res.json({
                status: 'success',
                statusCode: 200,
                message: msg,
                data: productData

            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

async function createProductHandler(req, res) {
    try {
        const productDetails = req.body;
        const product = await Product.create(productDetails);
        res.status(200).json({
            message: "Product created successfully",
            data: product
        })

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
    // const id = short.generate();

}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        // const Product = ProductData.find((Product) => Product.id === id);
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        res.json({
            status: 200,
            message: "Product Found",
            data: Product
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

async function updateProductById(req, res) {
    try {
        const { id } = req.params;
        const updatedProductData = req.body
        console.log('Productid', id);
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true })
        if (!updatedProduct) {
            throw new Error("Product not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Product updated successfully",
                data: updatedProduct
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

async function deleteProductById(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            throw new Error("Product not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Product deleted successfully",
                data: deletedProduct
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

module.exports = { getProductHandler, createProductHandler, getProductById, updateProductById, deleteProductById, checkInput }