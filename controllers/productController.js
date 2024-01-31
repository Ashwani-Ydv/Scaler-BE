const Product = require('../models/productModel')
const {
    checkInput,
    getAllFactory,
    getElementByIdFactory,
    createElementFactory
} = require('../utils/crudFactory');

/**handlers */
/** Route handlers */

const getProductHandler = getAllFactory(Product);
const getProductById = getElementByIdFactory(Product);
const createProductHandler = createElementFactory(Product);

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